import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form/immutable'

import ModalDialog from './ModalDialog'

//import WalletModel, { validate } from 'models/WalletModel'
const validate = () => true
import { modalsClose } from 'redux/modals/actions'

import './WalletAddEditDialog.scss'

import icnCirclePlus from 'assets/img/icn-circle-plus.svg'
import icnWalletDialogWhite from 'assets/img/icn-wallet-dialog-white.svg'

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
    initialValues: PropTypes.object,
    isEditMultisig: PropTypes.bool,
    isAddNotEdit: PropTypes.bool
  }

  static defaultProps = {
    isAddNotEdit: true,
    isEditMultisig: true
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
            <div id='WalletAddEditDialogHeader' styleName='dialogHeader'>
              <div styleName='dialogHeaderStuff'>
                <img styleName='dialogHeaderIcon' src={icnWalletDialogWhite} />
                <div styleName='dialogHeaderTitle'>{this.props.isAddNotEdit ? 'New wallet' : 'Edit wallet'}</div>
              </div>
            </div>
            {this.props.isEditMultisig ?
              <div styleName='dialogBody'>
                <Field component={TextField} name='walletName' fullWidth floatingLabelText='Wallet name'/>
                <Field component={TextField} name='dayLimit' fullWidth floatingLabelText='Day limit'/>
                <Field component={TextField} name='requiredSignatures' fullWidth
                  floatingLabelText='Required signatures'/>
                <div styleName='addOwner' onTouchTap={() => {
                  this.addOwner()
                }}>
                  <img styleName='addOwnerIcon' src={icnCirclePlus}/>
                  <div styleName='addOwnerTitle'>Add owner</div>
                </div>
                {this.state.owners.map((owner, idx) => <div key={idx} styleName='owner'>
                  <div styleName='ownerIcon'>
                    <i className='material-icons'>account_circle</i>
                  </div>
                  <div styleName='ownerAddressWrapper'>
                    <div
                      styleName={this.state.edit === idx ? 'hidden' : 'ownerAddress'}
                      onDoubleClick={() => this.editIdx(idx)}
                    >0x00d451bedd4f8567631b5811c1d3d57cfd410ddd
                    </div>
                    <div styleName={this.state.edit === idx ? 'addressInput' : 'hidden'}>
                      <Field
                        id={'add_edit_multisig_wallet_input_address_' + idx}
                        style={{marginTop: '0px'}}
                        component={TextField} name='ownerAddress'
                        fullWidth
                        onBlur={() => this.editDone()}
                        floatingLabelText='owner address'/>
                    </div>
                  </div>
                  <div styleName='ownerAddressControls'>
                    <i className='material-icons' styleName={this.state.edit === idx ? 'hidden' : 'pencil'}
                      onClick={() => this.editIdx(idx)}>edit</i>
                    <i className='material-icons' styleName='trash' onClick={() => this.deleteAddress(idx)}>delete</i>
                  </div>
                </div>)}
              </div>
              :
              <div styleName='dialogBody'>
                <Field component={TextField} name='walletName' fullWidth floatingLabelText='Wallet name'/>
              </div>
            }
            <div styleName='dialogFooter'>
              <RaisedButton
                styleName='action' label={this.props.isAddNotEdit ? 'Add wallet' : 'Save'}
                type='submit' primary disabled={this.props.submitting}
              />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

function mapStateToProps (state) {
  return {
    isEditMultisig: state.get('wallet').isEditMultisig,
    isAddNotEdit: state.get('wallet').isAddNotEdit
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
