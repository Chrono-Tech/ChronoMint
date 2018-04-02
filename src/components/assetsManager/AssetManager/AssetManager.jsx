import { Paper, RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { createPlatform, DUCK_ASSETS_MANAGER, getAssetsManagerData } from 'redux/assetsManager/actions'
import { modalsOpen } from 'redux/modals/actions'
import AddPlatformDialog from 'components/assetsManager/AddPlatformDialog/AddPlatformDialog'
import AddTokenDialog from 'components/assetsManager/AddTokenDialog/AddTokenDialog'
import HistoryTable from 'components/assetsManager/HistoryTable/HistoryTable'
import PlatformInfo from 'components/assetsManager/PlatformInfo/PlatformInfo'
import PlatformsList from 'components/assetsManager/PlatformsList/PlatformsList'
import Preloader from 'components/common/Preloader/Preloader'
import PlatformsSVG from 'assets/img/assets1.svg'
import TokensSVG from 'assets/img/assets2.svg'
import ManagersSVG from 'assets/img/assets3.svg'
import CrowdsaleSVG from 'assets/img/assets4.svg'
import './AssetManager.scss'

function prefix (token) {
  return `Assets.AssetManager.${token}`
}

function mapStateToProps (state) {
  const assetsManager = state.get(DUCK_ASSETS_MANAGER)
  return {
    platformsCount: assetsManager.usersPlatforms().length,
    tokensCount: Object.keys(assetsManager.assets()).length,
    managersCount: assetsManager.managersCount(),
    tokensOnCrowdsaleCount: assetsManager.tokensOnCrowdsaleCount(),
    selectedPlatform: assetsManager.selectedPlatform(),
    assetsManagerCountsLoading: assetsManager.isFetching() && !assetsManager.isFetched(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createPlatform: () => dispatch(createPlatform()),
    getAssetsManagerData: () => dispatch(getAssetsManagerData()),
    handleAddPlatformDialog: () => dispatch(modalsOpen({
      component: AddPlatformDialog,
    })),
    handleAddTokenDialog: () => dispatch(modalsOpen({
      component: AddTokenDialog,
    })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AssetManager extends PureComponent {
  static propTypes = {
    handleAddPlatformDialog: PropTypes.func,
    handleAddTokenDialog: PropTypes.func,
    platformsCount: PropTypes.number,
    tokensCount: PropTypes.number,
    managersCount: PropTypes.number,
    tokensOnCrowdsaleCount: PropTypes.number,
    assetsManagerCountsLoading: PropTypes.bool,
    getAssetsManagerData: PropTypes.func,
  }

  componentDidMount () {
    this.props.getAssetsManagerData()
  }

  renderHead () {

    const { platformsCount, tokensCount, managersCount, tokensOnCrowdsaleCount, assetsManagerCountsLoading } = this.props
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
                      <img src={PlatformsSVG} alt='' />
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('myPlatforms')} />:</span><br />
                      <span styleName='entry2'>
                        {assetsManagerCountsLoading ? <Preloader medium /> : platformsCount}
                      </span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsCompleted'>
                    <div styleName='icon'>
                      <img src={TokensSVG} alt='' />
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('myTokens')} />:</span><br />
                      <span styleName='entry2'>
                        {assetsManagerCountsLoading ? <Preloader medium /> : tokensCount}
                      </span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsOutdated'>
                    <div styleName='icon'>
                      <img src={ManagersSVG} alt='' />
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('managers')} />:</span><br />
                      <span styleName='entry2'>
                        {assetsManagerCountsLoading ? <Preloader medium /> : managersCount}
                      </span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsOutdated'>
                    <div styleName='icon'>
                      <img src={CrowdsaleSVG} alt='' />
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('tokensOnCrowdsale')} />:</span><br />
                      <span styleName='entry2'>
                        {assetsManagerCountsLoading ? <Preloader medium /> : tokensOnCrowdsaleCount}
                      </span>
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
                      onTouchTap={this.props.handleAddTokenDialog}
                      label={<Translate value={prefix('addToken')} />}
                      styleName='action'
                      primary
                    />
                    <RaisedButton
                      onTouchTap={this.props.handleAddPlatformDialog}
                      label={<Translate value={prefix('addNewPlatform')} />}
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
          <Paper>
            {this.renderHead()}
            {this.renderBody()}
          </Paper>
          <div styleName='delimiter' />
          <Paper>
            {this.renderTable()}
          </Paper>
        </div>
      </div>
    )
  }
}
