import PlatformInfo from 'components/assetsManager/PlatformInfo/PlatformInfo'
import PlatformsList from 'components/assetsManager/PlatformsList/PlatformsList'
import HistoryTable from 'components/assetsManager/HistoryTable/HistoryTable'
import {getAssetsManagerData, createPlatform, getTokens} from 'redux/assetsManager/actions'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Translate} from 'react-redux-i18n'
import {modalsOpen} from 'redux/modals/actions'
import AddPlatformDialog from 'components/assetsManager/AddPlatformDialog/AddPlatformDialog'
import AddTokenDialog from 'components/assetsManager/AddTokenDialog/AddTokenDialog'
import styles from 'layouts/partials/styles'
import {Paper, RaisedButton} from 'material-ui'
import './AssetManager.scss'

function prefix (token) {
  return `Assets.AssetManager.${token}`
}

export class AssetManager extends Component {
  static propTypes = {
    handleAddPlatformDialog: PropTypes.func,
    handleAddTokenDialog: PropTypes.func,
    getAssetsManagerData: PropTypes.func,
    platformsCount: PropTypes.number,
    platformsList: PropTypes.array,
    getTokens: PropTypes.func,
    tokensCount: PropTypes.number,
    managersCount: PropTypes.number,
    tokensOnCrowdsaleCount: PropTypes.number,
  }

  componentDidMount () {
    this.props.getAssetsManagerData()
    this.props.getTokens()
  }

  renderHead () {
    const {platformsCount, tokensCount, managersCount, tokensOnCrowdsaleCount} = this.props
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
                      <span styleName='entry2'>{platformsCount}</span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsCompleted'>
                    <div styleName='icon'>
                      <img src={require('assets/img/assets2.svg')} alt='' />
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('myTokens')} />:</span><br />
                      <span styleName='entry2'>{tokensCount}</span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsOutdated'>
                    <div styleName='icon'>
                      <img src={require('assets/img/assets3.svg')} alt='' />
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('managers')} />:</span><br />
                      <span styleName='entry2'>{managersCount}</span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsOutdated'>
                    <div styleName='icon'>
                      <img src={require('assets/img/assets4.svg')} alt='' />
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('tokensOnCrowdsale')} />:</span><br />
                      <span styleName='entry2'>{tokensOnCrowdsaleCount}</span>
                    </div>
                  </div>

                </div>
              </div>
              <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'>
                <div styleName='contentAlignRight'>
                  <div styleName='entries' />
                  <div styleName='actions'>
                    <RaisedButton
                      disabled={!platformsCount}
                      onTouchTap={() => this.props.handleAddTokenDialog()}
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

  renderBody () {
    return (
      <div styleName='body'>
        <div styleName='bodyInner'>
          <div className='AssetManagerContent__body'>
            <div className='row'>
              <div className='col-xs-2 col-sm-2 col-md-1 col-lg-1 col-xl-1'>
                <PlatformsList />
              </div>
              <div styleName='PlatformInfoWrap' className='col-xs-2 col-sm-2 col-md-1 col-lg-1 col-xl-1'>
                <PlatformInfo />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderTable () {
    return (
      <div styleName='table'>
        <div styleName='tableInner'>
          <HistoryTable />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <Paper style={styles.content.paper.style}>
            {this.renderHead()}
            {
              this.props.platformsList.length
                ? this.renderBody()
                : null
            }
          </Paper>
          <div styleName='delimiter' />
          <Paper style={styles.content.paper.style}>
            {this.renderTable()}
          </Paper>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const assetsManager = state.get('assetsManager')
  return {
    platformsCount: assetsManager.platformsCount,
    tokensCount: assetsManager.tokensCount,
    managersCount: assetsManager.managersCount,
    tokensOnCrowdsaleCount: assetsManager.tokensOnCrowdsaleCount,
    platformsList: assetsManager.platformsList,
    selectedPlatform: assetsManager.selectedPlatform,
  }
}

function mapDispatchToProps (dispatch, a, b, s) {
  return {
    getAssetsManagerData: () => dispatch(getAssetsManagerData()),
    createPlatform: () => dispatch(createPlatform()),
    getTokens: () => dispatch(getTokens()),
    handleAddPlatformDialog: () => dispatch(modalsOpen({
      component: AddPlatformDialog,
    })),
    handleAddTokenDialog: () => dispatch(modalsOpen({
      component: AddTokenDialog,
    })),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetManager)
