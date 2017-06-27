import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'

import { TextField, RaisedButton } from 'material-ui'
import ModalDialog from './ModalDialog'

import { modalsClose } from 'redux/modals/actions'

import './AddTokenDialog.scss'

export class AddTokenDialog extends React.Component {

  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    handleClose: PropTypes.func,
    handleSave: PropTypes.func
  }

  render() {

    return (
      <CSSTransitionGroup
        transitionName="transition-opacity"
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.handleClose()} styleName="root">
          <div styleName="content">
            <div styleName="header">
              Header
            </div>
            <div styleName="body">
              <div>
                <TextField fullWidth floatingLabelText="Token contract address" />
              </div>
              <div>
                <TextField fullWidth floatingLabelText="Token name" />
              </div>
              <div>
                <TextField fullWidth floatingLabelText="Token symbol" />
              </div>
              <div>
                <TextField fullWidth floatingLabelText="Decimals places of smallest unit" />
              </div>
            </div>
            <div styleName="footer">
              <RaisedButton styleName="action" label="Save" primary
                onTouchTap={() => this.props.handleSave()} />
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
    handleSave: () => {
      dispatch(modalsClose())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTokenDialog)
