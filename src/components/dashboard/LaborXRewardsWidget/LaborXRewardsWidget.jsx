/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { LHT } from '@chronobank/core/dao/constants'
import {
  getMainLaborHourWallet,
  selectRewardsBlocksList,
  selectRewardsBlocksListLoadingFlag,
  selectTotalRewards,
} from '@chronobank/core/redux/laborHour/selectors'
import { selectWallet } from '@chronobank/core/redux/wallet/actions'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import {
  getGetRewardsInfo,
  getRewardsBlocksList,
} from '@chronobank/core/redux/laborHour/thunks/rewards'
import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { prefix } from './lang'
import './LaborXRewardsWidget.scss'
import TokenValueSimple from '../../common/TokenValueSimple/TokenValueSimple'
import Preloader from '../../common/Preloader/Preloader'
import Moment from '../../common/Moment'
import Button from '../../common/ui/Button/Button'

function mapStateToProps (state) {
  const wallet = getMainLaborHourWallet(state)
  const totalRewards = selectTotalRewards(state)
  const rewardsBlocksList = selectRewardsBlocksList(state)
  const isListLoading = selectRewardsBlocksListLoadingFlag(state)
  return {
    wallet,
    totalRewards,
    rewardsBlocksList,
    isListLoading,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    selectWallet: (blockchain, address) =>
      dispatch(selectWallet(blockchain, address)),
    handleGetRewards: () => dispatch(getGetRewardsInfo()),
    handleGetRewardsBlocksList: () => dispatch(getRewardsBlocksList()),
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class LaborXRewardsWidget extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(WalletModel),
    selectWallet: PropTypes.func,
    handleGetRewards: PropTypes.func,
    totalRewards: PropTypes.instanceOf(Amount),
    handleGetRewardsBlocksList: PropTypes.func,
    isListLoading: PropTypes.bool,
    rewardsBlocksList: PropTypes.shape({
      hash: PropTypes.string,
      miner: PropTypes.string,
      signers: PropTypes.array,
      number: PropTypes.number,
      timestamp: PropTypes.number,
      totalTxFee: PropTypes.string,
      uncleAmount: PropTypes.number,
      rewards: PropTypes.arrayOf(
        PropTypes.shape({
          reward: PropTypes.string,
          address: PropTypes.string,
        })
      ),
    }),
  }

  componentDidMount () {
    this.props.handleGetRewards()
  }

  handleSelectLink = (blockchain, address) => () => {
    this.props.selectWallet(blockchain, address)
  }

  handleLoadMore = () => {
    this.props.handleGetRewardsBlocksList()
  }

  renderBlock (block) {
    const reward = new Amount(block.rewards[0].reward, LHT)
    return (
      <div styleName='row' key={block.number}>
        <div styleName='column'>
          <Moment
            date={block.timestamp * 1000}
            format='Do MMMM YYYY, HH:mm:ss'
          />
        </div>
        <div styleName='column'>{block.number}</div>
        <div styleName='column'>
          LHT <TokenValueSimple value={reward} withFraction />
        </div>
      </div>
    )
  }

  render () {
    const {
      wallet,
      totalRewards,
      rewardsBlocksList,
      isListLoading,
    } = this.props

    if (!wallet) {
      return null
    }

    return (
      <div styleName='root'>
        <div styleName='container'>
          <div styleName='header'>
            <div styleName='title'>
              <Translate value={`${prefix}.title`} />
            </div>
            <div styleName='subTitle'>
              <Translate value={`${prefix}.subTitle`} />{' '}
              <Link
                to='/wallet'
                onClick={this.handleSelectLink(
                  wallet.blockchain,
                  wallet.address
                )}
              >
                <Translate value={`${prefix}.walletLink`} />
              </Link>
            </div>
          </div>
          <div styleName='table'>
            <div styleName='tableHeader'>
              <div styleName='column'>
                <Translate value={`${prefix}.date`} />
              </div>
              <div styleName='column'>
                <Translate value={`${prefix}.block`} />
              </div>
              <div styleName='column'>
                <Translate value={`${prefix}.reward`} />
                <TokenValueSimple value={totalRewards} withFraction />
              </div>
            </div>
            <div styleName='tableBody'>
              {rewardsBlocksList ? (
                Object.values(rewardsBlocksList).map((block) =>
                  this.renderBlock(block)
                )
              ) : (
                <Preloader />
              )}
            </div>
            <div styleName='tableFooter'>
              <Button
                flat
                label={
                  isListLoading ? (
                    <Preloader
                      style={{ verticalAlign: 'middle', marginTop: -2 }}
                      size={24}
                      thickness={1.5}
                    />
                  ) : (
                    <Translate
                      value={
                        Object.values(rewardsBlocksList).length > 0
                          ? `${prefix}.more`
                          : `${prefix}.load`
                      }
                    />
                  )
                }
                disabled={isListLoading}
                onClick={this.handleLoadMore}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
