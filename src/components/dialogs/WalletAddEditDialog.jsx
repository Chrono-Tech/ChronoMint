import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton, FloatingActionButton, FontIcon } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form/immutable'

import ModalDialog from './ModalDialog'

//import WalletModel, { validate } from 'models/WalletModel'
const validate = () => true
import { modalsClose } from 'redux/modals/actions'

import './WalletAddEditDialog.scss'

export const FORM_WALLET_ADD_EDIT_DIALOG = 'WalletAddEditDialog'

@reduxForm({form: FORM_WALLET_ADD_EDIT_DIALOG, validate})
export class WalletAddEditDialog extends React.Component {
  constructor (props) {
    super(props)
    this.justStartedEditing = false
  }

  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    initialValues: PropTypes.object
  }

  componentWillMount () {
    this.setState({owners: [], edit: null})
  }

  addOwner () {
    const owners = [...this.state.owners]
    owners.push({})
    this.setState({...this.state, owners})
  }

  deleteAddress (idx) {
    const owners = [...this.state.owners]
    let edit = null
    if (idx > this.state.edit) {
      edit = this.state.edit
    } else if (idx < this.state.edit) {
      edit = this.state.edit - 1
    }
    owners.splice(idx, 1)
    this.setState({...this.state, owners, edit})
  }

  editIdx (idx) {
    this.setState({...this.state, edit: idx})
    this.justStartedEditing = true
    setTimeout(() => {
      document.getElementById('add_edit_multisig_wallet_input_address_' + idx).focus()
      setTimeout(() => {
        this.justStartedEditing = false
      }, 0)
    }, 0)
  }

  editDone () {
    setTimeout(() => {
      if (!this.justStartedEditing) this.setState({...this.state, edit: null})
    }, 0)
  }

  render () {

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog id='WalletAddEditDialog' onClose={() => this.props.onClose()} styleName='root'>
          <form styleName='content' onSubmit={this.props.handleSubmit}>
            <div id='WalletAddEditDialogHeader' styleName='header'>
            </div>
            <div styleName='body'>
              <Field component={TextField} name='walletname' fullWidth floatingLabelText='Wallet name' />
              <Field component={TextField} name='ownersnumber' fullWidth floatingLabelText='Owners number' />
              <Field component={TextField} name='daylimit' fullWidth floatingLabelText='Day limit' />
              <Field component={TextField} name='reqsignatures' fullWidth floatingLabelText='Required signatures' />
              <div styleName='add'>
                <FloatingActionButton style={{size: '32px'}} onTouchTap={() => { this.addOwner() }}>
                  <FontIcon className='material-icons'>add</FontIcon>
                </FloatingActionButton>
                <div styleName='addacc'>Add account</div>
              </div>
              {this.state.owners.map((owner, idx) => <div key={idx} styleName='wallet'>
                <div styleName='account'>
                  <i className='material-icons'>account_circle</i>
                </div>
                <div styleName='waddress'>
                  <div
                    styleName={this.state.edit === idx ? 'hidden' : 'address'}
                    onDoubleClick={() => this.editIdx(idx)}
                  >0x00d451bedd4f8567631b5811c1d3d57cfd410ddd</div>
                  <div styleName={this.state.edit === idx ? 'addrinput' : 'hidden'}>
                    <Field
                      id={'add_edit_multisig_wallet_input_address_' + idx}
                      style={{marginTop: '0px'}}
                      component={TextField} name='address'
                      fullWidth
                      onBlur={() => this.editDone()}
                      floatingLabelText='address' />
                  </div>
                </div>
                <div styleName='controls'>
                  <i className='material-icons' styleName={this.state.edit === idx ? 'hidden' : 'pencil'} onClick={() => this.editIdx(idx)}>edit</i>
                  <i className='material-icons' styleName='trash' onClick={() => this.deleteAddress(idx)}>delete</i>
                </div>
              </div>)}
            </div>
            <div styleName='footer'>
              <RaisedButton styleName='action' label='Add wallet' type='submit' primary disabled={this.props.submitting} />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

function mapStateToProps () {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => {
      dispatch(modalsClose())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletAddEditDialog)
