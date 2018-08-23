import uuid from 'uuid/v1'
import { TIME } from '@chronobank/login/network/constants'
import { findFunctionABI, TransactionDescriber } from '../TransactionDescriber'
import { Amount, LogTxModel } from '../../../models'
import { VotingManagerABI, PollInterfaceABI } from '../../../dao/abi'
import web3Converter from '../../../utils/Web3Converter'
import {
  TX_ACTIVATE_POLL,
  TX_REMOVE_POLL,
  TX_VOTE,
  TX_END_POLL,
} from '../../../dao/constants/PollInterfaceDAO'
import { TX_CREATE_POLL } from '../../../dao/constants/VotingManagerDAO'

export const FUNCTION_POLL_CREATED = new TransactionDescriber(
  findFunctionABI(VotingManagerABI, TX_CREATE_POLL),
  ({ tx, block }, { address }, { params }) => {
    address = address.toLowerCase()
    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {

      const path = `tx.${VotingManagerABI.contractName}.${TX_CREATE_POLL}`
      const hash = web3Converter.bytes32ToIPFSHash('0x' + params._detailsIpfsHash.toString('hex'))
      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_CREATE_POLL,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.modalTitle`,
        path,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.to`,
          },
          {
            value: new Date(params._deadline.toNumber()),
            description: `${path}.deadline`,
          },
          {
            value: new Amount(params._votelimit, TIME),
            description: `${path}.votelimit`,
          },
          {
            value: hash,
            type: 'ipfsHash',
          },
        ],
      })
    }
  },
)

export const FUNCTION_ACTIVATE_POLL = new TransactionDescriber(
  findFunctionABI(PollInterfaceABI, TX_ACTIVATE_POLL),
  ({ tx, block }, { address }) => {
    address = address.toLowerCase()
    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {

      const path = `tx.${PollInterfaceABI.contractName}.${TX_ACTIVATE_POLL}`
      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_ACTIVATE_POLL,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.modalTitle`,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.pollAddress`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_VOTE = new TransactionDescriber(
  findFunctionABI(PollInterfaceABI, TX_VOTE),
  ({ tx, block }, { address }, { params }) => {
    address = address.toLowerCase()
    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {

      const path = `tx.${PollInterfaceABI.contractName}.${TX_VOTE}`
      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_VOTE,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.modalTitle`,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.pollAddress`,
          },
          {
            value: params._choice,
            description: `${path}.choiceNumber`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_REMOVE_POLL = new TransactionDescriber(
  findFunctionABI(PollInterfaceABI, TX_REMOVE_POLL),
  ({ tx, block }, { address }) => {
    address = address.toLowerCase()
    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {

      const path = `tx.${PollInterfaceABI.contractName}.${TX_REMOVE_POLL}`
      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_REMOVE_POLL,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.modalTitle`,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.pollAddress`,
          },
        ],
      })
    }
  },
)

export const FUNCTION_END_POLL = new TransactionDescriber(
  findFunctionABI(PollInterfaceABI, TX_END_POLL),
  ({ tx, block }, { address }) => {
    address = address.toLowerCase()
    if (tx.to.toLowerCase() === address || tx.from.toLowerCase() === address) {

      const path = `tx.${PollInterfaceABI.contractName}.${TX_END_POLL}`
      return new LogTxModel({
        key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
        name: TX_END_POLL,
        date: new Date(block ? (block.timestamp * 1000) : null),
        title: `${path}.modalTitle`,
        fields: [
          {
            value: tx.from,
            description: `${path}.from`,
          },
          {
            value: tx.to,
            description: `${path}.pollAddress`,
          },
        ],
      })
    }
  },
)
