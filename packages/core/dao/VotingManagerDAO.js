/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import ipfs from '@chronobank/core-dependencies/utils/IPFS'
import PollNoticeModel, { IS_REMOVED } from '../models/notices/PollNoticeModel'
import PollModel from '../models/PollModel'
import PollDetailsModel from '../models/PollDetailsModel'
import FileModel from '../models/FileSelect/FileModel'
import VotingCollection from '../models/voting/VotingCollection'
import Amount from '../models/Amount'
import votingService from '../services/VotingService'
import { daoByType } from '../refactor/redux/daos/selectors'
import PollInterfaceManagerDAO from '../refactor/daos/lib/PollInterfaceManagerDAO'
import contractsManagerDAO from './ContractsManagerDAO'
import web3Converter from '../utils/Web3Converter'
import AbstractContractDAO from '../refactor/daos/lib/AbstractContractDAO'

export const TX_CREATE_POLL = 'createPoll'
export const TX_REMOVE_POLL = 'removePoll'
export const TX_ACTIVATE_POLL = 'activatePoll'

export const EVENT_POLL_CREATED = 'PollCreated'
export const EVENT_POLL_UPDATED = 'PollUpdated'
export const EVENT_POLL_REMOVED = 'PollRemoved'

export default class VotingManagerDAO extends AbstractContractDAO {
  /**
   * @type Web3Converter
   * @protected
   */
  _c = web3Converter

  constructor ({ address, history, abi }) {
    super({ address, history, abi })

    this.assetHolderDAO = null
    this.pollInterfaceManagerDAO = null
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

  postStoreDispatchSetup (state, web3, history) {
    const assetHolderDAO = daoByType('TimeHolder')(state)
    const pollsInterfaceManagerDAO = new PollInterfaceManagerDAO({ web3, history })
    this.setPollInterfaceManagerDAO(pollsInterfaceManagerDAO)
    this.setAssetHolderDAO(assetHolderDAO)
  }

  async getPollsPaginated (startIndex, pageSize, account: string): Promise {
    const addresses = await this.contract.methods.getPollsPaginated(startIndex, pageSize).call()
    console.log('Polls addresses: ', addresses)
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
    summary = { ...poll.txSummary(), ...options }

    const tx = await this._tx(TX_CREATE_POLL, [
      poll.options.length,
      this._c.ipfsHashToBytes32(hash),
      new BigNumber(voteLimitInTIME),
      poll.deadline.getTime(),
    ], new BigNumber(0), new BigNumber(0), summary)

    return tx
  }

  removePoll () {
    return this._tx(TX_REMOVE_POLL)
  }

  activatePoll () {
    return this._multisigTx(TX_ACTIVATE_POLL)
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
            let [ votes, hasMember, memberOption ] = await Promise.all([
              await pollInterface.getVotesBalances(),
              await pollInterface.hasMember(account),
              await pollInterface.memberOption(account),
            ])
            memberOption = new BigNumber(memberOption)

            const hash = this._c.bytes32ToIPFSHash(bytesHashes[i])
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
              options: new Immutable.List(options || []),
              files,
              hasMember,
              memberOption,
            })

            const pollFiles = poll && await ipfs.get(poll.files)

            const pollDetailModel = new PollDetailsModel({
              id: pollAddress,
              poll,
              votes,
              shareholdersCount,
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
    const polls = await this.getPollsDetails([ pollId ], account)
    return polls.item(pollId)
  }

  getVoteLimitInPercent () {
    return this.contract.methods.getVotesPercent().call()
  }

  /** @private */
  _watchCallback = (callback, status, account: string) => async (result) => {
    let notice = new PollNoticeModel({
      pollId: result.args.pollAddress, // just a long
      status,
      transactionHash: result.transactionHash,
    })

    if (status !== IS_REMOVED) {
      const poll = await this.getPoll(result.args.pollAddress, account)
      notice = notice.poll(poll)
    }

    callback(notice)
  }

  watchCreated (callback, account) {
    // return this._watch(EVENT_POLL_CREATED, this._watchCallback(callback, IS_CREATED, account))
  }

  watchUpdated (callback) {
    // return this._watch(EVENT_POLL_UPDATED, this._watchCallback(callback, IS_UPDATED))
  }

  watchRemoved (callback) {
    // return this._watch(EVENT_POLL_REMOVED, this._watchCallback(callback, IS_REMOVED))
  }

  /** @private */
  _watchCallback = (callback, status, account: string) => async (result) => {

    const dao = await contractsManagerDAO.getVotingManagerDAO()
    const poll = await dao.getPoll(result.args.self, account)

    callback(new PollNoticeModel({
      pollId: result.args.self, // just a long
      poll,
      status,
      transactionHash: result.transactionHash,
    }))
  }

  async watchVoted (callback, filter, account) {
    // return this._watch(EVENT_POLL_VOTED, this._watchCallback(callback, IS_VOTED, account), filter)
  }

  async watchActivated (callback, filter) {
    // return this._watch(EVENT_POLL_ACTIVATED, this._watchCallback(callback, IS_ACTIVATED), filter)
  }

  async watchEnded (callback, filter) {
    // return this._watch(EVENT_POLL_ENDED, this._watchCallback(callback, IS_ENDED), filter)
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
