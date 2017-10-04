import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import PlatformsList from 'components/assets/PlatformsList/PlatformsList'
import { modalsOpen } from 'redux/modals/actions'
import AddPlatformDialog from 'components/assets/AddPlatformDialog/AddPlatformDialog'

import { RaisedButton } from 'material-ui'

import './AssetManager.scss'
import { PlatformInfo } from '../PlatformInfo/PlatformInfo'

function prefix (token) {
  return 'Assets.AssetManager.' + token
}

export class AssetManager extends Component {
  static propTypes = {
    handleAddPlatformDialog: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.state = {
      selectedToken: null
    }
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          {this.renderHead()}
          {this.renderBody()}
        </div>
      </div>
    )
  }

  renderHead () {
    return (
      <div styleName='head'>
        <h3><Translate value={prefix('title')} /></h3>
        <div styleName='headInner'>
          <div className='AssetManagerContent__head'>
            <div className='row'>
              <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'>
                <div styleName='contentStats'>
                  <div styleName='contentStatsItem statsAll'>
                    <div styleName='icon'>
                      <img src={require('assets/img/assets1.svg')} alt='' />
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('myPlatforms')} />:</span><br />
                      <span styleName='entry2'>1</span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsCompleted'>
                    <div styleName='icon'>
                      <img src={require('assets/img/assets2.svg')} alt='' />
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('myTokens')} />:</span><br />
                      <span styleName='entry2'>1</span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsOutdated'>
                    <div styleName='icon'>
                      <img src={require('assets/img/assets3.svg')} alt='' />
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('managers')} />:</span><br />
                      <span styleName='entry2'>1</span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsOutdated'>
                    <div styleName='icon'>
                      <img src={require('assets/img/assets4.svg')} alt='' />
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('tokensOnCrowdsale')} />:</span><br />
                      <span styleName='entry2'>1</span>
                    </div>
                  </div>

                </div>
              </div>
              <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'>
                <div styleName='contentAlignRight'>
                  <div styleName='entries'>
                  </div>
                  <div>
                    <RaisedButton
                      label={<Translate value={prefix('addToken')} />}
                      styleName='action'
                      primary
                    />
                    <RaisedButton
                      onTouchTap={() => this.props.handleAddPlatformDialog()}
                      label={<Translate value={prefix('addNewPlatforms')} />}
                      styleName='action'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleSelectToken (token) {
    this.setState({selectedToken: token})
  }

  renderBody () {
    return (
      <div styleName='body'>
        <div styleName='bodyInner'>
          <div className='AssetManagerContent__body'>
            <div className='row'>
              <div className='col-xs-2 col-sm-2 col-md-1 col-lg-1 col-xl-1'>
                <PlatformsList
                  handleSelectToken={(token) => this.handleSelectToken(token)}
                  selectedToken={this.state.selectedToken} />
              </div>
              <div styleName='PlatformInfoWrap' className='col-xs-2 col-sm-2 col-md-1 col-lg-1 col-xl-1'>
                {
                  this.state.selectedToken
                    ? <PlatformInfo selectedToken={this.state.selectedToken} />
                    : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (/*state*/) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    handleAddPlatformDialog: () => dispatch(modalsOpen({
      component: AddPlatformDialog
    })),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetManager)
