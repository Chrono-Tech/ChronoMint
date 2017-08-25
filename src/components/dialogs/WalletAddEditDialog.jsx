import React from 'react'
import { I18n } from 'react-redux-i18n'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
//noinspection JSUnresolvedVariable
import { Field, reduxForm } from 'redux-form/immutable'

import ModalDialog from './ModalDialog'
import OwnerItem from '../wallet/OwnerItem'

import WalletModel from '../../models/wallet/WalletModel'
//const validate = (values, props) => {
//  //console.log('values =', values, 'props =', props)
//  return true
//}

import { modalsClose } from 'redux/modals/actions'

import './WalletAddEditDialog.scss'

import icnCirclePlus from 'assets/img/icn-circle-plus.svg'
import icnWalletDialogWhite from 'assets/img/icn-wallet-dialog-white.svg'

import OwnersCollection from 'models/wallet/OwnersCollection'
import OwnerModel from 'models/wallet/OwnerModel'

export const FORM_WALLET_ADD_EDIT_DIALOG = 'WalletAddEditDialog'
const TRANSITION_TIMEOUT = 250

const validate = (values) => {
  const wallet = new WalletModel(values.toJS())
  return wallet.validate()
}

@reduxForm({form: FORM_WALLET_ADD_EDIT_DIALOG, validate})
export class WalletAddEditDialog extends React.Component {
  state = {}

  constructor (props) {
    super(props)
    this.state = {
      wallet: new WalletModel({
        isNew: true,
        walletName: null,
        dayLimit: null,
        requiredSignatures: null,
        ownersCollection: new OwnersCollection()
          .addOwner(new OwnerModel({
            ...OwnerModel.genSymbol()
          }))
      })
    }
  }

  /** @namespace PropTypes.func */
  /** @namespace PropTypes.bool */
  /** @namespace PropTypes.string */
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    submitting: PropTypes.bool,
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

  addOwnerToCollection = () => {
    //this.setState({
    //  ownersCollection: this.state.ownersCollection
    //    .addOwner(new OwnerModel({
    //      ...OwnerModel.genSymbol()
    //    }))
    //})
    this.setState({
      wallet: this.state.wallet.addOwner(new OwnerModel({
        ...OwnerModel.genSymbol()
      }))
    })
  }

  deleteOwnerFromCollection = (symbol) => {
    this.setState({
      wallet: this.state.wallet.removeOwner(symbol)
    })
  }

  editOwner = (owner) => {
    this.setState({
      //wallet: this.state.wallet.updateOwner(owner.set('editing', true))
      wallet: this.state.wallet.addOwner(owner.set('editing', true))
    })
  }

  editOwnerDone = (owner) => {
    this.setState({
      //wallet: this.state.wallet.updateOwner(owner.set('editing', false))
      wallet: this.state.wallet.addOwner(owner.set('editing', false))
    })
  }

  render () {
    //const isNew = wallet.get('isNew')

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={TRANSITION_TIMEOUT}
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}>
        <ModalDialog onClose={() => this.props.onClose()}>
          <form styleName='content' onSubmit={this.props.handleSubmit}>
            <div styleName='dialogHeader'>
              <div styleName='dialogHeaderStuff'>
                <img styleName='dialogHeaderIcon' src={icnWalletDialogWhite} />
                <div
                  styleName='dialogHeaderTitle'>{I18n.t('wallet.WalletAddEditDialog.' + (this.props.isAddNotEdit ? 'New wallet' : 'Edit wallet'))}</div>
              </div>
            </div>
            {this.props.isEditMultisig ?
              <div styleName='dialogBody'>
                <Field component={TextField} name='walletName' fullWidth
                  floatingLabelText={I18n.t('wallet.WalletAddEditDialog.Wallet name')} />
                <Field component={TextField} name='dayLimit' fullWidth
                  floatingLabelText={I18n.t('wallet.WalletAddEditDialog.Day limit')} />
                <Field component={TextField} name='requiredSignatures' fullWidth
                  floatingLabelText={I18n.t('wallet.WalletAddEditDialog.Required signatures')} />
                <div styleName='ownersCounterWrapper'>
                  <div styleName='ownersCounterLabel'>{I18n.t('wallet.WalletAddEditDialog.Wallet owners')}
                    &nbsp;&mdash;&nbsp;
                  </div>
                  <div styleName='ownersCounterNumber'>{this.state.wallet.ownersCount()}</div>
                </div>
                <div styleName='addOwner' onTouchTap={() => {
                  this.addOwnerToCollection()
                }}>
                  <img styleName='addOwnerIcon' src={icnCirclePlus} />
                  <div styleName='addOwnerTitle'>{I18n.t('wallet.WalletAddEditDialog.Add owner')}</div>
                </div>
                {this.state.wallet.owners().toArray().map((owner, idx) => <Field
                  component={OwnerItem}
                  name={'ownerAddress_' + owner.symbol()}
                  owner={owner}
                  key={idx}
                  editOwner={this.editOwner}
                  editOwnerDone={this.editOwnerDone}
                  deleteOwnerFromCollection={this.deleteOwnerFromCollection}
                  validate={OwnerItem.validate}
                />)}
              </div>
              :
              <div styleName='dialogBody'>
                <Field component={TextField} name='walletName' fullWidth
                  floatingLabelText={I18n.t('wallet.WalletAddEditDialog.Wallet name')} />
              </div>
            }
            <div styleName='dialogFooter'>
              <RaisedButton
                styleName='action'
                label={I18n.t('wallet.WalletAddEditDialog.' + (this.props.isAddNotEdit ? 'Add wallet' : 'Save'))}
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
