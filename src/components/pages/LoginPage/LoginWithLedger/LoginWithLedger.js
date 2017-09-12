import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { startLedgerSync, stopLedgerSync } from 'redux/ledger/actions'
import { CircularProgress, RaisedButton } from 'material-ui'
import './LoginWithLedger.scss'
import BackButton from '../BackButton/BackButton'
import { fetchAccount } from 'redux/ledger/actions'
import { Translate } from 'react-redux-i18n'

const ledgerStates = [{
  flag: 'isHttps',
  successTitle: <Translate value='LoginWithLedger.isHttps.successTitle'/>,
  errorTitle: <Translate value='LoginWithLedger.isHttps.errorTitle'/>,
  errorTip: <Translate value='LoginWithLedger.isHttps.errorTip'/>
}, {
  flag: 'isU2F',
  successTitle: <Translate value='LoginWithLedger.isU2F.successTitle'/>,
  errorTitle: <Translate value='LoginWithLedger.isU2F.errorTitle'/>,
  errorTip: <Translate value='LoginWithLedger.isU2F.errorTip'/>
}, {
  flag: 'isETHAppOpened',
  successTitle: <Translate value='LoginWithLedger.isETHAppOpened.successTitle'/>,
  errorTitle: <Translate value='LoginWithLedger.isETHAppOpened.errorTitle'/>,
  errorTip: <Translate value='LoginWithLedger.isETHAppOpened.errorTip'/>
}, {
  flag: 'isFetched',
  successTitle: <Translate value='LoginWithLedger.isFetched.successTitle'/>,
  errorTitle: <Translate value='LoginWithLedger.isFetched.errorTitle'/>,
  errorTip: <Translate value='LoginWithLedger.isFetched.errorTip'/>
}]

const mapStateToProps = (state) => {
  const network = state.get('network')
  return {
    ledger: state.get('ledger'),
    isLoading: network.isLoading,
    account: network.selectedAccount
  }
}

const mapDispatchToProps = (dispatch) => ({
  startLedgerSync: () => dispatch(startLedgerSync()),
  stopLedgerSync: (isReset) => dispatch(stopLedgerSync(isReset)),
  fetchAccount: () => dispatch(fetchAccount())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginLedger extends Component {
  static propTypes = {
    startLedgerSync: PropTypes.func,
    stopLedgerSync: PropTypes.func,
    fetchAccount: PropTypes.func,
    onBack: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    ledger: PropTypes.object,
    isLoading: PropTypes.bool,
    account: PropTypes.string
  }

  componentWillMount () {
    this.props.startLedgerSync()
  }

  componentWillUnmount () {
    this.props.stopLedgerSync()
  }

  componentWillReceiveProps ({ledger}) {
    if (!ledger.isFetched && !ledger.isFetching && ledger.isHttps && ledger.isU2F && ledger.isETHAppOpened) {
      this.props.fetchAccount()
    }
  }

  handleBackClick = () => {
    this.props.stopLedgerSync(true)
    this.props.onBack()
  }

  renderStates () {
    const {ledger} = this.props

    return ledgerStates.map(item => ledger[item.flag]
      ? (
        <div styleName='state' key={item.flag}>
          <div styleName='flag flagDone' className='material-icons'>done</div>
          <div styleName='titleContent'>{item.successTitle}</div>
        </div>
      )
      : (
        <div styleName='state' key={item.flag}>
          <div styleName='flag flagError' className='material-icons'>error</div>
          <div styleName='titleContent'>
            <div styleName='title'>{item.errorTitle}</div>
            <div styleName='subtitle'>{item.errorTip}</div>
          </div>
        </div>
      )
    )
  }

  render () {
    const {isLoading, ledger, account} = this.props

    return (
      <div styleName='root'>
        <BackButton
          onClick={this.handleBackClick}
          to='options'
        />

        <div styleName='states'>
          {this.renderStates()}
        </div>

        {ledger.isFetched && (
          <div styleName='account'>
            <div styleName='accountLabel'>ETH Address</div>
            <div styleName='accountValue'>{account}</div>
          </div>
        )}

        <div styleName='actions'>
          <div styleName='action'>
            <RaisedButton
              label={isLoading
                ? (
                  <CircularProgress
                    style={{verticalAlign: 'middle', marginTop: -2}}
                    size={24}
                    thickness={1.5}/>
                )
                : <Translate value='LoginWithLedger.login'/>
              }
              primary
              fullWidth
              disabled={isLoading || !account}
              onTouchTap={() => this.props.onLogin()}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LoginLedger
