/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import ipfs from '@chronobank/core-dependencies/utils/IPFS'
// import PollNoticeModel, { IS_CREATED, IS_REMOVED, IS_UPDATED } from '../models/notices/PollNoticeModel'
import PollModel from '../models/PollModel'
import PollDetailsModel from '../models/PollDetailsModel'
import FileModel from '../models/FileSelect/FileModel'
import VotingCollection from '../models/voting/VotingCollection'
import Amount from '../models/Amount'
// import { TIME } from '../redux/mainWallet/actions'
import votingService from '../services/VotingService'
import { daoByType } from '../refactor/redux/daos/selectors'
import PollInterfaceManagerDAO from '../refactor/daos/lib/PollInterfaceManagerDAO'

export const TX_CREATE_POLL = 'createPoll'
export const TX_REMOVE_POLL = 'removePoll'
export const TX_ACTIVATE_POLL = 'activatePoll'

export const EVENT_POLL_CREATED = 'PollCreated'
export const EVENT_POLL_UPDATED = 'PollUpdated'
export const EVENT_POLL_REMOVED = 'PollRemoved'

export default class VotingManagerDAO  {
  constructor ({ address, history, abi }) {
    this.address = address
    this.history = history
    this.abi = abi
    this.assetHolderDAO = null
    this.pollInterfaceManagerDAO = null
  }

  connect (web3, options) {
    if (this.isConnected) {
      this.disconnect()
    }
    // eslint-disable-next-line no-console
    console.log('[VotingManagerDAO] Connected')

    this.contract = new web3.eth.Contract(this.abi.abi, this.address, options)
  }

  get isConnected () {
    return this.contract != null
  }

  disconnect () {
    if (this.isConnected) {
      this.contract = null
      this.history = null
    }
  }

  getVoteLimit (): Promise {
    return this._call('getVoteLimit')
  }

  setAssetHolderDAO (assetHolderDAO) {
    this.assetHolderDAO = assetHolderDAO
  }

  setPollInterfaceManagerDAO (pollInterfaceDAO) {
    this.pollInterfaceManagerDAO = pollInterfaceDAO
  }

  postStoreDispatchSetup (state, web3, history) {
    const assetHolderDAO = daoByType('TimeHolder')(state)
    const pollsInterfaceManagerDAO = new PollInterfaceManagerDAO({ web3, history })
    this.setPollInterfaceManagerDAO(pollsInterfaceManagerDAO)
    this.setAssetHolderDAO(assetHolderDAO)
  }

  async getPollsPaginated (startIndex, pageSize, account: string): Promise {
    const addresses = await this.contract.methods.getPollsPaginated(startIndex, pageSize).call()
    return this.getPollsDetails(addresses.filter((address) => !this.isEmptyAddress(address)), account)
  }

  // async createPoll (poll: PollModel) {
  //   // TODO @ipavlenko: It may be suitable to handle IPFS error and dispatch
  //   // a failure notice.
  //   let hash
  //   try {
  //     hash = await ipfs.put({
  //       title: poll.title(),
  //       description: poll.description(),
  //       files: poll.files(),
  //       options: poll.options() && poll.options().toArray(),
  //     })
  //   } catch (e) {
  //     // eslint-disable-next-line
  //     console.error(e.message)
  //   }
  //
  //   const voteLimitInTIME = poll.voteLimitInTIME()
  //
  //   const summary = poll.txSummary()
  //   summary.voteLimitInTIME = new Amount(voteLimitInTIME, TIME)
  //
  //   const tx = await this._tx(TX_CREATE_POLL, [
  //     poll.options().size,
  //     this._c.ipfsHashToBytes32(hash),
  //     new BigNumber(voteLimitInTIME),
  //     poll.deadline().getTime(),
  //   ], summary)
  //   return tx.tx
  // }
  //
  // removePoll () {
  //   return this._tx(TX_REMOVE_POLL)
  // }
  //
  // activatePoll () {
  //   return this._multisigTx(TX_ACTIVATE_POLL)
  // }
  //

  async getPollsDetails (pollsAddresses: Array<string>, account: string) {
    let result = []
    try {
      const pollsDetails = await this.contract.methods.getPollsDetails(pollsAddresses)

      const [ owners, bytesHashes, voteLimits, deadlines, statuses, activeStatuses, publishedDates ] = pollsDetails
      const shareholdersCount = await this.assetHolderDAO.shareholdersCount()

      let promises = []
      for (let i = 0; i < pollsAddresses.length; i++) {
        promises.push(new Promise(async (resolve) => {
          try {
            const pollAddress = pollsAddresses[ i ]

            try {
              votingService.subscribeToPoll(pollAddress, account)
            } catch (e) {
              // eslint-disable-next-line
              console.error('watch error', e.message)
            }

            const pollInterface = await this.pollInterfaceManagerDAO.getPollInterfaceDAO(pollAddress)
            const [ votes, hasMember, memberOption ] = await Promise.all([
              await pollInterface.getVotesBalances(),
              await pollInterface.hasMember(account),
              await pollInterface.memberOption(account),
            ])

            const hash = this._c.bytes32ToIPFSHash(bytesHashes[ i ])
            const { title, description, options, files } = await ipfs.get(hash)
            const poll = new PollModel({
              id: pollAddress,
              owner: owners[ i ],
              hash,
              votes,
              title,
              description,
              voteLimitInTIME: voteLimits[ i ].equals(new BigNumber(0)) ? null : new Amount(voteLimits[ i ], 'TIME'),
              deadline: deadlines[ i ].toNumber() ? new Date(deadlines[ i ].toNumber()) : null, // deadline is just a timestamp
              published: publishedDates[ i ].toNumber() ? new Date(publishedDates[ i ].toNumber() * 1000) : null, // published is just a timestamp
              status: statuses[ i ],
              active: activeStatuses[ i ],
              options: new Immutable.List(options || []),
              files,
              hasMember,
              memberOption,
            })
            const pollFiles = poll && await ipfs.get(poll.files())

            resolve(new PollDetailsModel({
              id: pollAddress,
              poll,
              votes,
              shareholdersCount,
              files: new Immutable.List((pollFiles && pollFiles.links || [])
                .map((item) => FileModel.createFromLink(item))),
            })
              .isFetched(true))

          } catch (e) {
            // eslint-disable-next-line
            console.error(e.message)
            resolve(null) // return null
          }
        }))
      }

      result = await Promise.all(promises)
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message)
    }

    let collection = new VotingCollection()
    result.map((item) => {
      if (item) {
        collection = collection.add(item)
      }
    })

    return collection
  }

  isEmptyAddress (v): boolean {
    return v === '0x0000000000000000000000000000000000000000'
  }

  // async getPoll (pollId: string, account: string): PollDetailsModel {
  //   const votingManagerDAO = await contractsManagerDAO.getVotingManagerDAO()
  //   const polls = await votingManagerDAO.getPollsDetails([ pollId ], account)
  //   return polls.item(pollId)
  // }
  //
  // getVoteLimitInPercent () {
  //   return this._call('getVotesPercent')
  // }
  //
  // /** @private */
  // _watchCallback = (callback, status, account: string) => async (result) => {
  //   let notice = new PollNoticeModel({
  //     pollId: result.args.pollAddress, // just a long
  //     status,
  //     transactionHash: result.transactionHash,
  //   })
  //
  //   if (status !== IS_REMOVED) {
  //     const poll = await this.getPoll(result.args.pollAddress, account)
  //     notice = notice.poll(poll)
  //   }
  //
  //   callback(notice)
  // }
  //
  // watchCreated (callback, account) {
  //   return this._watch(EVENT_POLL_CREATED, this._watchCallback(callback, IS_CREATED, account))
  // }
  //
  // watchUpdated (callback) {
  //   return this._watch(EVENT_POLL_UPDATED, this._watchCallback(callback, IS_UPDATED))
  // }
  //
  // watchRemoved (callback) {
  //   return this._watch(EVENT_POLL_REMOVED, this._watchCallback(callback, IS_REMOVED))
  // }
}
