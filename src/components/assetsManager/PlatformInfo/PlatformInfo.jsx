import { IPFSImage, TokenValue } from 'components'
import AssetManagerDialog from 'components/assetsManager/AssetManagerDialog/AssetManagerDialog'
import CrowdsaleDialog from 'components/assetsManager/CrowdsaleDialog/CrowdsaleDialog'
import RevokeDialog from 'components/assetsManager/RevokeDialog/RevokeDialog'
import Preloader from 'components/common/Preloader/Preloader'
import Immutable from 'immutable'
import { FlatButton, RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { getFee, getManagersForAssetSymbol, isReissuable } from 'redux/assetsManager/actions'
import { modalsOpen } from 'redux/modals/actions'
import ReissueAssetForm from '../ReissueAssetForm/ReissueAssetForm'

import './PlatformInfo.scss'

function prefix (token) {
  return `Assets.PlatformInfo.${token}`
}

export class PlatformInfo extends PureComponent {
  static propTypes = {
    tokensMap: PropTypes.instanceOf(Immutable.Map),
    selectedToken: PropTypes.string,
    selectedPlatform: PropTypes.string,
    handleCrowdsaleDialog: PropTypes.func,
    handleAddManagerDialog: PropTypes.func,
    getManagersForAssetSymbol: PropTypes.func,
    managersForTokenLoading: PropTypes.bool,
    reissueAsset: PropTypes.func,
    handleRevokeDialog: PropTypes.func,
    isReissuable: PropTypes.func,
    getFee: PropTypes.func,
    platformsList: PropTypes.arrayOf(PropTypes.object),
    usersPlatforms: PropTypes.arrayOf(PropTypes.object),
  }

  componentWillReceiveProps (newProps) {
    if (newProps.selectedToken) {
      const token = newProps.tokensMap.get(newProps.selectedToken)
      if (token) {
        if (token.managersList() === null) {
          this.props.getManagersForAssetSymbol(newProps.selectedToken)
        }
        if (token.isReissuable() === null) {
          this.props.isReissuable(token)
        }
        if (token.withFee() === null) {
          this.props.getFee(token)
        }
      }
    }
  }

  renderInstructions () {
    if (!this.props.usersPlatforms.length && !this.props.platformsList.length) {
      return (
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='instructionCreatePlatform'>
              <Translate value={prefix('createPlatform')} />
            </div>
          </div>
        </div>
      )
    }

    if (this.props.usersPlatforms.length && !this.props.platformsList.length) {
      return (
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='instructionCreatePlatform'>
              <Translate value={prefix('createToken')} />
            </div>
          </div>
        </div>
      )
    }

    if (!this.props.selectedPlatform) {
      return (
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='instructionPlatform'>
              <Translate value={prefix('selectPlatform')} />
            </div>
          </div>
        </div>
      )
    }

    if (!this.props.selectedToken) {
      return (
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='instructionToken'>
              <Translate value={prefix('selectToken')} />
            </div>
          </div>
        </div>
      )
    }
  }

  renderManagers (managersList) {
    return (
      <div styleName='managersRow'>
        {
          this.props.managersForTokenLoading
            ? <div styleName='avatarsPreLoader'><Preloader /></div>
            : (
              <div styleName='title'>
                {(managersList || 0).length}&nbsp;<Translate value={prefix('managers')} />
                <div styleName='avatarsRow'>
                  {
                    managersList && managersList
                      .map((manager) => <div key={manager}><i className='material-icons'>account_circle</i></div>)
                  }
                </div>

                <div styleName='addManager'>
                  <FlatButton
                    onTouchTap={this.props.handleAddManagerDialog}
                    styleName='addManagerButton'
                    label={(
                      <span>
                        <i className='material-icons'>add_circle</i>
                        <Translate value={prefix('addManagers')} />
                      </span>
                    )}
                  />
                </div>
              </div>
            )

        }
      </div>

    )
  }

  renderFee () {
    const selectedToken = this.props.tokensMap.get(this.props.selectedToken)
    let value
    switch (selectedToken.withFee()) {
      case true:
        value = <span>{selectedToken.fee()}<span>%</span></span>
        break
      case false:
        value = <Translate value={prefix('withoutFee')} />
        break
      default:
        value = <div styleName='preloader'><Preloader /></div>
    }
    return (
      <div styleName='fee'>
        <div styleName='title'><Translate value={prefix('fee')} />:</div>
        <div styleName='value'>
          {value}
        </div>
      </div>
    )
  }

  render () {
    const selectedToken = this.props.tokensMap.get(this.props.selectedToken)

    if (!this.props.selectedPlatform || !this.props.selectedToken || !selectedToken) return this.renderInstructions()

    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='balanceRow'>
            <div styleName='iconWrap'>
              <IPFSImage styleName='tokenIcon' multihash={selectedToken.icon()} />
            </div>
            <div styleName='dataWrap'>
              <div styleName='title'>{selectedToken.symbol()}</div>
              <div styleName='addressTitle'>{selectedToken.address()}</div>
              <div styleName='balanceWrap'>
                <div styleName='balance'>
                  <div styleName='title'><Translate value={prefix('issuedAmount')} />:</div>
                  <TokenValue
                    style={{ fontSize: '24px' }}
                    value={selectedToken.totalSupply()}
                    symbol={selectedToken.symbol()}
                  />
                </div>
                {this.renderFee()}
              </div>
            </div>
          </div>
          {selectedToken.isReissuable() && <ReissueAssetForm />}
          {this.renderManagers(selectedToken.managersList())}

          <div styleName='actions'>
            {/*<FlatButton
              styleName='action'
              label={<Translate value={prefix('send')} />}
            />*/}

            {/*<FlatButton
              styleName='action'
              label={<Translate value={prefix('crowdsaleInfo')} />}
              onTouchTap={() => this.props.handleCrowdsaleDialog()}
            />*/}

            <RaisedButton
              onTouchTap={this.props.handleRevokeDialog}
              label={<Translate value={prefix('revoke')} />}
              styleName='action'
            />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const assetsManager = state.get('assetsManager')
  return {
    selectedToken: assetsManager.selectedToken,
    selectedPlatform: assetsManager.selectedPlatform,
    managersForTokenLoading: assetsManager.managersForTokenLoading,
    tokensMap: assetsManager.tokensMap,
    platformsList: assetsManager.platformsList,
    usersPlatforms: assetsManager.usersPlatforms,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleCrowdsaleDialog: () => dispatch(modalsOpen({
      component: CrowdsaleDialog,
    })),
    handleAddManagerDialog: () => dispatch(modalsOpen({
      component: AssetManagerDialog,
    })),
    getManagersForAssetSymbol: (symbol) => dispatch(getManagersForAssetSymbol(symbol)),
    isReissuable: (symbol) => dispatch(isReissuable(symbol)),
    getFee: (symbol) => dispatch(getFee(symbol)),
    handleRevokeDialog: () => dispatch(modalsOpen({
      component: RevokeDialog,
    })),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatformInfo)
