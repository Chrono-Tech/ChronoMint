import React from 'react'
import { I18n } from 'react-redux-i18n'
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

import OwnersCollection from 'models/wallet/OwnersCollection'
import OwnerModel from 'models/wallet/OwnerModel'

export const FORM_WALLET_ADD_EDIT_DIALOG = 'WalletAddEditDialog'

@reduxForm({form: FORM_WALLET_ADD_EDIT_DIALOG, validate})
export class WalletAddEditDialog extends React.Component {
  constructor (props) {
    super(props)
    this.justStartedEditing = false
    this.state = {
      ownersCollection: new OwnersCollection()
    }
    this.state.ownersCollection = this.state.ownersCollection.add(new OwnerModel({
      //address: '0x00d451bedd4f8567631b5811c1d3d57cfd410ddd'
      address: '0x00d451bedd4f8567631b5811c1d3d' + Date.now()
    }))
  }

  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    initialValues: PropTypes.object,
    isEditMultisig: PropTypes.bool,
    isAddNotEdit: PropTypes.bool,
    locale: PropTypes.string
  }

  static defaultProps = {
    isAddNotEdit: true,
    isEditMultisig: true
  }

  componentWillMount () {
    this.setState({owners: [], edit: null})
  }

  addOwnerToCollection () {
    this.setState({
      ownersCollection: this.state.ownersCollection.add(new OwnerModel({
        //address: '0x00d451bedd4f8567631b5811c1d3d57cfd410ddd'
        address: '0x00d451bedd4f8567631b5811c1d3d' + Date.now()
      }))
    })
  }

  deleteOwnerFromCollection (address) {
    this.setState({
      ownersCollection: this.state.ownersCollection.remove(address)
    })
  }

  editOwner (owner) {
    this.setState({
      ownersCollection: this.state.ownersCollection.update(owner.set('editing', true))
    })
    setTimeout(() => {
      document.getElementById('add_edit_multisig_wallet_input_address_' + owner.address()).focus()
    }, 0)
  }

  editOwnerDone (owner) {
    this.setState({
      ownersCollection: this.state.ownersCollection.update(owner.set('editing', false))
    })
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.onClose()} styleName='root'>
          <form styleName='content' onSubmit={this.props.handleSubmit}>
            <div styleName='dialogHeader'>
              <div styleName='dialogHeaderStuff'>
                <img styleName='dialogHeaderIcon' src={icnWalletDialogWhite} />
                <div styleName='dialogHeaderTitle'>{I18n.t('wallet.WalletAddEditDialog.' + (this.props.isAddNotEdit ? 'New wallet' : 'Edit wallet'))}</div>
              </div>
            </div>
            {this.props.isEditMultisig ?
              <div styleName='dialogBody'>
                <Field component={TextField} name='walletName' fullWidth floatingLabelText={I18n.t('wallet.WalletAddEditDialog.Wallet name')}/>
                <Field component={TextField} name='dayLimit' fullWidth floatingLabelText={I18n.t('wallet.WalletAddEditDialog.Day limit')}/>
                <Field component={TextField} name='requiredSignatures' fullWidth floatingLabelText={I18n.t('wallet.WalletAddEditDialog.Required signatures')}/>
                <div styleName='ownersCounterWrapper'>
                  <div styleName='ownersCounterLabel'>{I18n.t('wallet.WalletAddEditDialog.Wallet owners')} &mdash;&nbsp;</div>
                  <div styleName='ownersCounterNumber'>{this.state.ownersCollection.owners().size}</div>
                </div>
                <div styleName='addOwner' onTouchTap={() => {
                  //this.addOwner()
                  this.addOwnerToCollection()
                }}>
                  <img styleName='addOwnerIcon' src={icnCirclePlus}/>
                  <div styleName='addOwnerTitle'>{I18n.t('wallet.WalletAddEditDialog.Add owner')}</div>
                </div>
                {this.state.ownersCollection.owners().map((owner, idx) => <div key={idx} styleName='owner'>
                  <div styleName='ownerIcon'>
                    <i className='material-icons'>account_circle</i>
                  </div>
                  <div styleName='ownerAddressWrapper'>
                    <div
                      styleName={owner.editing() ? 'hidden' : 'ownerAddress'}
                      onDoubleClick={() => this.editOwner(owner)}
                    >{owner.address()}
                    </div>
                    <div styleName={owner.editing() ? 'addressInput' : 'hidden'}>
                      <Field
                        id={'add_edit_multisig_wallet_input_address_' + owner.address()}
                        style={{marginTop: '0px'}}
                        component={TextField} name={'ownerAddress_' + owner.address()}
                        fullWidth
                        onBlur={() => this.editOwnerDone(owner)}
                        floatingLabelText={I18n.t('wallet.WalletAddEditDialog.Owner address')}/>
                    </div>
                  </div>
                  <div styleName='ownerAddressControls'>
                    <i className='material-icons' styleName={owner.editing() ? 'hidden' : 'pencil'}
                      onClick={() => this.editOwner(owner)}>edit</i>
                    <i className='material-icons' styleName='trash' onClick={() => {
                      this.deleteOwnerFromCollection(owner.address())
                    }}>delete</i>
                  </div>
                </div>)}
              </div>
              :
              <div styleName='dialogBody'>
                <Field component={TextField} name='walletName' fullWidth floatingLabelText={I18n.t('wallet.WalletAddEditDialog.Wallet name')}/>
              </div>
            }
            <div styleName='dialogFooter'>
              <RaisedButton
                styleName='action' label={I18n.t('wallet.WalletAddEditDialog.' + (this.props.isAddNotEdit ? 'Add wallet' : 'Save'))}
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
    isAddNotEdit: state.get('wallet').isAddNotEdit,
    locale: state.get('i18n').locale,
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
