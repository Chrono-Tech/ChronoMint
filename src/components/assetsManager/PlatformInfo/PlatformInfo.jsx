import Preloader from 'components/common/Preloader/Preloader'
import BigNumber from 'bignumber.js'
import {Field, reduxForm} from 'redux-form/immutable'
import {IPFSImage, TokenValue} from 'components'
import PropTypes from 'prop-types'
import {RaisedButton, FlatButton} from 'material-ui'
import React, {Component} from 'react'
import {TextField} from 'redux-form-material-ui'
import {Translate} from 'react-redux-i18n'
import {connect} from 'react-redux'
import {getManagersForAssetSymbol} from 'redux/assetsManager/actions'
import {modalsOpen} from 'redux/modals/actions'
import CrowdsaleDialog from 'components/assetsManager/CrowdsaleDialog/CrowdsaleDialog'
import AssetManagerDialog from 'components/assetsManager/AssetManagerDialog/AssetManagerDialog'

import './PlatformInfo.scss'

function prefix (token) {
  return `Assets.PlatformInfo.${token}`
}

@reduxForm({form: 'REISSUE_FORM'})
export class PlatformInfo extends Component {
  static propTypes = {
    tokensMap: PropTypes.object,
    selectedToken: PropTypes.string,
    selectedPlatform: PropTypes.string,
    handleCrowdsaleDialog: PropTypes.func,
    handleAddManagerDialog: PropTypes.func,
    getManagersForAssetSymbol: PropTypes.func,
    managersForTokenLoading: PropTypes.bool,
  }

  componentWillReceiveProps (newProps) {
    if ((newProps.selectedToken && !this.props.selectedToken) ||
      (this.props.selectedToken && this.props.selectedToken !== newProps.selectedToken)) {
      this.props.getManagersForAssetSymbol(newProps.selectedToken)
    }
  }

  handleSubmit () {

  }

  renderInstructions () {
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
                      .map(manager => <div key={manager}><i className='material-icons'>account_circle</i></div>)
                  }
                </div>

                <div styleName='addManager'>
                  <FlatButton
                    onTouchTap={() => this.props.handleAddManagerDialog()}
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

  render () {
    const selectedToken = this.props.tokensMap.get(this.props.selectedToken)

    if (!this.props.selectedPlatform || !this.props.selectedToken) return this.renderInstructions()

    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='balanceRow'>
            <div styleName='status'>
              <Translate value={prefix('onCrowdsale')} />
            </div>
            <IPFSImage styleName='tokenIcon' multihash={selectedToken.icon()} />
            <div styleName='title'>{selectedToken.symbol()}</div>
            <div styleName='balanceWrap'>
              <div styleName='balance'>
                <div styleName='title'><Translate value={prefix('issuedAmount')} />:</div>
                <TokenValue
                  style={{fontSize: '24px'}}
                  value={new BigNumber(selectedToken.totalSupply())}
                  symbol={selectedToken.symbol()}
                />
              </div>
              {
                selectedToken.fee() &&
                <div styleName='fee'>
                  <div styleName='title'><Translate value={prefix('fee')} />:</div>
                  <div styleName='value'>
                    {selectedToken.fee()}<span>%</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <div styleName='reissueRow'>
            <form onSubmit={this.handleSubmit}>
              <div styleName='input'>
                <Field
                  component={TextField}
                  fullWidth
                  name='reissue'
                  style={{width: '100%'}}
                  floatingLabelText={<Translate value={prefix('reissueAmount')} />}
                />
              </div>
              <RaisedButton
                primary
                label={<Translate value={prefix('reissue')} />}
                styleName='action'
              />
            </form>
          </div>

          {
            this.renderManagers(selectedToken.managersList())
          }

          <div styleName='actions'>
            <FlatButton
              styleName='action'
              label={<Translate value={prefix('send')} />}
            />

            <FlatButton
              styleName='action'
              label={<Translate value={prefix('crowdsaleInfo')} />}
              onTouchTap={() => this.props.handleCrowdsaleDialog()}
            />

            <RaisedButton
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
    getManagersForAssetSymbol: symbol => dispatch(getManagersForAssetSymbol(symbol)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatformInfo)
