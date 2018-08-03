/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import ipfs from '@chronobank/core-dependencies/utils/IPFS'
import PollNoticeModel from '../models/notices/PollNoticeModel'
import PollModel from '../models/PollModel'
import PollDetailsModel from '../models/PollDetailsModel'
import FileModel from '../models/FileSelect/FileModel'
import VotingCollection from '../models/voting/VotingCollection'
import Amount from '../models/Amount'
import votingService from '../services/VotingService'
import { daoByType } from '../redux/daos/selectors'
import PollInterfaceManagerDAO from './PollInterfaceManagerDAO'
import web3Converter from '../utils/Web3Converter'
import AbstractContractDAO from './AbstractContract3DAO'

//#region CONSTANTS

import {
  IS_CREATED,
  IS_REMOVED,
  IS_UPDATED,
} from '../models/constants/PollNoticeModel'
import {
  TX_CREATE_POLL,
} from './constants/VotingManagerDAO'
import {
  EVENT_POLL_CREATED,
  EVENT_POLL_REMOVED,
  EVENT_POLL_UPDATED,
} from './constants/PollEmitterDAO'

//#endregion

export default class VotingManagerDAO extends AbstractContractDAO {

  constructor ({ address, history, abi }) {
    super({ address, history, abi })

    this.assetHolderDAO = null
    this.pollInterfaceManagerDAO = null
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleEventsData.bind(this))
      .on('changed', this.handleEventsChanged.bind(this))
      .on('error', this.handleEventsError.bind(this))
  }

  disconnect () {
    if (this.isConnected) {
      this.allEventsEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  handleEventsData (data) {
    if (!data.event) {
      return
    }
    console.log('VotingManagerDAO handleEventsData: ', data.event, data)
    this.emit(data.event, data)
  }

  handleEventsChanged (data) {
    console.log('handleEventsChanged: ', data.event, data)
  }

  handleEventsError (data) {
    console.log('handleEventsError: ', data.event, data)
    this.emit(data.event + '_error', data)
  }

  getVoteLimit (): Promise {
    return this.contract.methods.getVoteLimit().call()
  }

  setAssetHolderDAO (assetHolderDAO) {
    this.assetHolderDAO = assetHolderDAO
  }

  setPollInterfaceManagerDAO (pollInterfaceDAO) {
    this.pollInterfaceManagerDAO = pollInterfaceDAO
  }

  postStoreDispatchSetup (state, web3, history, subscribeTxFlow) {
    const assetHolderDAO = daoByType('TimeHolder')(state)
    const pollsInterfaceManagerDAO = new PollInterfaceManagerDAO({ web3, history, subscribeTxFlow })
    this.setPollInterfaceManagerDAO(pollsInterfaceManagerDAO)
    this.setAssetHolderDAO(assetHolderDAO)
  }

  async getPollsPaginated (startIndex, pageSize, account: string): Promise {
    const addresses = await this.contract.methods.getPollsPaginated(startIndex, pageSize).call()
    return this.getPollsDetails(addresses.filter((address) => !this.isEmptyAddress(address)), account)
  }

  async createPoll (poll: PollModel, options) {
    // TODO @ipavlenko: It may be suitable to handle IPFS error and dispatch
    // a failure notice.
    let hash
    try {
      hash = await ipfs.put({
        title: poll.title,
        description: poll.description,
        files: poll.files,
        options: poll.options,
      })
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message)
    }

    const voteLimitInTIME = poll.voteLimitInTIME
    let summary = poll.txSummary()
    summary.voteLimitInTIME = new Amount(voteLimitInTIME, 'TIME')
    summary = { ...poll.txSummary(), blockchain: 'Ethereum' }

    await this._tx(TX_CREATE_POLL, [
      poll.options.length,
      web3Converter.ipfsHashToBytes32(hash),
      new BigNumber(voteLimitInTIME),
      poll.deadline.getTime(),
    ], new BigNumber(0), new BigNumber(0), summary, { stubPoll: options.stubPoll })
  }

  async getPollsDetails (pollsAddresses: Array<string>, account: string) {
    let result = []
    try {
      const pollsDetails = await this.contract.methods.getPollsDetails(pollsAddresses).call()

      const owners = pollsDetails[0].map((o) => o.toLowerCase())
      const bytesHashes = pollsDetails[1]
      const voteLimits = pollsDetails[2].map((l) => new BigNumber(l))
      const deadlines = pollsDetails[3].map((l) => new BigNumber(l))
      const statuses = pollsDetails[4]
      const activeStatuses = pollsDetails[5]
      const publishedDates = pollsDetails[6].map((l) => new BigNumber(l))
      const shareholdersCount = await this.assetHolderDAO.shareholdersCount()

      let promises = []
      for (let i = 0; i < pollsAddresses.length; i++) {
        promises.push(new Promise(async (resolve) => {
          try {
            const pollAddress = pollsAddresses[i].toLowerCase()

            try {
              votingService.subscribeToPoll(pollAddress, account)
            } catch (e) {
              // eslint-disable-next-line
              console.error('watch error', e.message)
            }

            const pollInterface = await this.pollInterfaceManagerDAO.getPollInterfaceDAO(pollAddress)

            let [votes, hasMember, memberOption] = await Promise.all([
              await pollInterface.getVotesBalances(),
              await pollInterface.hasMember(account),
              await pollInterface.memberOption(account),
            ])
            memberOption = new BigNumber(memberOption)

            const hash = web3Converter.bytes32ToIPFSHash(bytesHashes[i])
            const result = await ipfs.get(hash)
            if (!result) {
              throw new Error(`ipfs hash [${hash}] for voting is outdated`)
            }
            const { title, description, options, files } = result

            const poll = new PollModel({
              id: pollAddress,
              owner: owners[i],
              hash,
              votes,
              title,
              description,
              voteLimitInTIME: voteLimits[i].equals(new BigNumber(0)) ? null : new Amount(voteLimits[i], 'TIME'),
              deadline: deadlines[i].toNumber() ? new Date(deadlines[i].toNumber()) : null, // deadline is just a timestamp
              published: publishedDates[i].toNumber() ? new Date(publishedDates[i].toNumber() * 1000) : null, // published is just a timestamp
              status: statuses[i],
              active: activeStatuses[i],
              options: options,
              files,
              hasMember,
              memberOption,
            })

            const pollFiles = poll && await ipfs.get(poll.files)

            const pollDetailModel = new PollDetailsModel({
              id: pollAddress,
              poll,
              votes,
              shareholdersCount: new BigNumber(shareholdersCount),
              isFetched: true,
              isFetching: false,
              files: new Immutable.List((pollFiles && pollFiles.links || [])
                .map((item) => FileModel.createFromLink(item))),
            })

            resolve(pollDetailModel)

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
      console.error('getPollsDetails error: ' + e.message)
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

  async getPoll (pollId: string, account: string): PollDetailsModel {
    const polls = await this.getPollsDetails([pollId], account)
    return polls.item(pollId)
  }

  getVoteLimitInPercent () {
    return this.contract.methods.getVotesPercent().call()
  }

  /** @private */
  _watchCallback = (callback, status, account: string) => async (result) => {
    let notice = new PollNoticeModel({
      pollId: result.returnValues.pollAddress.toLowerCase(),
      status,
      transactionHash: result.transactionHash,
    })

    if (status !== IS_REMOVED) {
      const poll = await this.getPoll(result.returnValues.pollAddress.toLowerCase(), account)
      notice = notice.poll(poll)
    }

    callback(notice)
  }

  watchCreated (callback, account) {
    return this.on(EVENT_POLL_CREATED, this._watchCallback(callback, IS_CREATED, account))
  }

  watchUpdated (callback) {
    return this.on(EVENT_POLL_UPDATED, this._watchCallback(callback, IS_UPDATED))
  }

  watchRemoved (callback) {
    return this.on(EVENT_POLL_REMOVED, this._watchCallback(callback, IS_REMOVED))
  }

  estimateGasForVoting = async (mode: string, params, callback, gasPriceMultiplier = 1) => {
    try {
      const estimateParams = params[1]
      estimateParams[1] = this.web3.utils.asciiToHex(new String(estimateParams[1]))
      const { gasLimit, gasFee, gasPrice } = await this.estimateGas(...params)
      callback(null, {
        gasLimit,
        gasFee: new Amount(gasFee.mul(gasPriceMultiplier), 'ETH'),
        gasPrice: new Amount(gasPrice.mul(gasPriceMultiplier), 'ETH'),
      })
    } catch (e) {
      callback(e)
    }
  }
}
