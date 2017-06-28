import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
// import { I18n } from 'react-redux-i18n'
import { CSSTransitionGroup } from 'react-transition-group'

import Immutable from 'immutable'

import { RaisedButton, FloatingActionButton, FontIcon, Checkbox } from 'material-ui'

import ModalDialog from './ModalDialog'
import AddTokenDialog from './AddTokenDialog'
import Points from 'components/common/Points/Points'

import ProfileModel from 'models/ProfileModel'
import { updateUserProfile } from 'redux/session/actions'
import { modalsOpen, modalsClose } from 'redux/modals/actions'

import './AddCurrencyDialog.scss'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: require('assets/img/icn-ethereum.svg'),
  // LHUS: require('assets/img/icn-lhus.svg'),
  TIME: require('assets/img/icn-time.svg')
}

export class AddCurrencyDialog extends React.Component {

  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    tokens: PropTypes.object,
    isTokensLoaded: PropTypes.bool,
    handleAddToken: PropTypes.func,
    handleClose: PropTypes.func,
    handleSave: PropTypes.func
  }

  constructor(props) {
    super(props)

    const tokens = this.props.tokens.entrySeq().toArray()

    this.state = {
      items: tokens.map(([name, token]) => ({
        selected: this.props.profile.tokens().contains(name),
        token,
        name
      }))
    }
  }

  handleCurrencyChecked(item, value){

    const items = this.state.items
    const index = items.indexOf(item)
    if (index >= 0) {
      items.splice(index, 1, {
        ...item,
        selected: value
      })
      this.setState({
        items
      })
    }
  }

  render() {

    return !this.props.isTokensLoaded ? null : (
      <CSSTransitionGroup
        transitionName="transition-opacity"
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.handleClose()} styleName="root">
          <div styleName="content">
            <div styleName="header">
              <h3>Tokens</h3>
              <div styleName="subtitle">Add Token</div>
            </div>
            <div styleName="actions">
              <div styleName="items">
                <div styleName="item">
                  <FloatingActionButton onTouchTap={() => { this.props.handleAddToken() }}>
                    <FontIcon className="material-icons">add</FontIcon>
                  </FloatingActionButton>
                </div>
              </div>
            </div>
            <div styleName="body">
              <div styleName="column">
                <h5>All tokens</h5>
                <div styleName="table">
                  { this.state.items.map((item) => this.renderRow(item)) }
                </div>
              </div>
              <div styleName="column">
                <h5>How to add your token. It&#39;s easy!</h5>
                <div styleName="description">
                  <p>
                    Once the printer ink runs dry it has to be replaced
                    with another inkjet cartridge. There are many reputed
                    companies like Canon, Epson, Dell, and Lexmark that
                    provide the necessary cartridges to replace the empty
                    cartridges.
                  </p>
                </div>
                <Points>
                  <span>
                    You should lorem ipsum very much
                    You should lorem ipsum very much
                  </span>
                  <span>
                    You should lorem ipsum very much
                    You should lorem ipsum very much
                  </span>
                  <span>
                    You should lorem ipsum very much
                    You should lorem ipsum very much
                  </span>
                </Points>
              </div>
            </div>
            <div styleName="footer">
              <RaisedButton styleName="action" label="Save" primary
                onTouchTap={() => this.props.handleSave(
                  this.props.profile,
                  this.state.items.filter((item) => item.selected).map(item => item.name)
                )} />
              <RaisedButton styleName="action" label="Close" onTouchTap={() => this.props.handleClose()} />
            </div>
          </div>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }

  renderRow (item) {

    const symbol = item.token.symbol()
    const [ balance1, balance2 ] = ('' + item.token.balance()).split('.')
    const icon = item.token.icon() || ICON_OVERRIDES[item.token.name().toUpperCase()]

    return (
      <div key={item.token.name()} styleName={classnames('row', { 'row-selected': item.selected })}
        onTouchTap={() => this.handleCurrencyChecked(item, !item.selected)}
      >
        <div styleName="cell">
          <div styleName="icon">
            <div styleName="content" style={{ backgroundImage: `url("${icon}")` }}></div>
            <div styleName="label">{symbol}</div>
          </div>
        </div>
        <div styleName="cell cell-auto">
          <div styleName="symbol">{symbol}</div>
          <div styleName="value">
            <span styleName="value1">{balance1}</span>
            {!balance2 ? null : (
              <span styleName="value2">.{balance2}</span>
            )}&nbsp;
            <span styleName="value3">{symbol}</span>
          </div>
        </div>
        <div styleName="cell">
          <Checkbox checked={item.selected} />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const session = state.get('session')
  const wallet = state.get('wallet')

  return {
    account: session.account,
    profile: session.profile,
    isTokensLoaded: !wallet.tokensFetching,
    tokens: wallet.tokens
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleAddToken: (data) => dispatch(modalsOpen({
      component: AddTokenDialog,
      data
    })),
    handleClose: () => dispatch(modalsClose()),
    handleSave: (profile, tokens) => {

      dispatch(updateUserProfile(
        new ProfileModel({
          name: profile.name(),
          email: profile.email(),
          company: profile.company(),
          tokens: new Immutable.Set(tokens),
        })
      ))

      dispatch(modalsClose())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCurrencyDialog)
