import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { I18n } from 'react-redux-i18n'
import { CSSTransitionGroup } from 'react-transition-group'

import Immutable from 'immutable'

import { RaisedButton, Table, TableBody, TableRow, TableRowColumn } from 'material-ui'

import ModalDialog from './ModalDialog'

import ProfileModel from 'models/ProfileModel'
import { updateUserProfile } from 'redux/session/actions'
import { modalsClose } from 'redux/modals/actions'

import './AddCurrencyDialog.scss'

export class AddCurrencyDialog extends React.Component {

  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    tokens: PropTypes.object,
    isTokensLoaded: PropTypes.bool,
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

  handleRowSelection(rows){

    const items = this.state.items.map((item, i) => ({
      ...item,
      selected: rows.indexOf(i) > -1,
    }))

    this.setState({
      items
    })
  }

  render() {

    return !this.props.isTokensLoaded ? null : (
      <CSSTransitionGroup
        transitionName="transition-opacity"
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.handleClose()}>
          <div styleName="root">
            <div styleName="header">
              <h3>Dashboard Tokens</h3>
            </div>
            <div styleName="content">
              <Table multiSelectable={true} onRowSelection={(rows) => this.handleRowSelection(rows)}>
                <TableBody
                  displayRowCheckbox={true}
                  deselectOnClickaway={false}
                  showRowHover={true}
                >
                  { this.state.items.map((item) => (
                    <TableRow key={item.name} selected={item.selected}>
                      <TableRowColumn>{item.name}</TableRowColumn>
                    </TableRow>
                  )) }
                </TableBody>
              </Table>
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
