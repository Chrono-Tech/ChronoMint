import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
//noinspection JSUnresolvedVariable
import { Field, reduxForm } from 'redux-form/immutable'

import ModalDialog from '../ModalDialog'
import OwnerItem from '../../wallet/OwnerItem'
import OwnersCount from '../../wallet/OwnersCount'

import WalletModel from '../../../models/wallet/WalletModel'

import { modalsClose } from 'redux/modals/actions'

import './WalletAddEditDialog.scss'

import icnCirclePlus from 'assets/img/icn-circle-plus.svg'
import icnWalletDialogWhite from 'assets/img/icn-wallet-dialog-white.svg'

import OwnerModel from 'models/wallet/OwnerModel'

export const FORM_WALLET_ADD_EDIT_DIALOG = 'WalletAddEditDialog'
const TRANSITION_TIMEOUT = 250

function mapStateToProps (state) {
  return {
    isEditMultisig: state.get('wallet').isEditMultisig,
    isAddNotEdit: state.get('wallet').isAddNotEdit,
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

const validate = (values) => {
  const valuesJS = values.toJS()
  let wallet = new WalletModel(valuesJS)
  let i
  for (i = 0; i < valuesJS.ownersCount; i++) {
    wallet = wallet.addOwner(new OwnerModel({
      ...OwnerModel.genSymbol()
    }))
  }
  let ret = wallet.validate()
  Object.keys(ret).forEach(key => {
    if (ret[key]) {
      ret[key] = <Translate value={ret[key]} />
    }
  })
  return ret
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({form: FORM_WALLET_ADD_EDIT_DIALOG, validate})
export default class WalletAddEditDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      wallet: new WalletModel({
        isNew: true,
        walletName: null,
        dayLimit: null,
        requiredSignatures: null
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
      wallet: this.state.wallet.updateOwner(owner.set('editing', true))
      //wallet: this.state.wallet.addOwner(owner.set('editing', true))
    })
  }

  editOwnerDone = (owner) => {
    this.setState({
      wallet: this.state.wallet.updateOwner(owner.set('editing', false))
      //wallet: this.state.wallet.addOwner(owner.set('editing', false))
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
                <div styleName='dialogHeaderTitle'>
                  <Translate
                    value={('wallet.walletAddEditDialog.' + (this.props.isAddNotEdit ? 'newWallet' : 'editWallet'))}
                  />
                </div>
              </div>
            </div>
            {this.props.isEditMultisig ?
              <div styleName='dialogBody'>
                <Field component={TextField} name='walletName' fullWidth
                  floatingLabelText={<Translate value='wallet.walletAddEditDialog.walletName' />} />
                <Field component={TextField} name='dayLimit' fullWidth
                  floatingLabelText={<Translate value='wallet.walletAddEditDialog.dayLimit' />} />
                <Field component={TextField} name='requiredSignatures' fullWidth
                  floatingLabelText={<Translate value='wallet.walletAddEditDialog.requiredSignatures' /> } />
                <Field
                  component={OwnersCount}
                  name='ownersCount'
                  props={{
                    count: this.state.wallet.ownersCount()
                  }}
                />
                <div styleName='addOwner' onTouchTap={() => {
                  this.addOwnerToCollection()
                }}>
                  <img styleName='addOwnerIcon' src={icnCirclePlus} />
                  <div styleName='addOwnerTitle'><Translate value='wallet.walletAddEditDialog.addOwner' /></div>
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
                  floatingLabelText={<Translate value='wallet.walletAddEditDialog.walletName' />} />
              </div>
            }
            <div
              styleName='dialogFooter'>
              <RaisedButton
                styleName='action'
                label={<Translate value={'wallet.walletAddEditDialog.' + (this.props.isAddNotEdit ? 'addWallet' : 'save')} />}
                type='submit' primary disabled={this.props.submitting}
              />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}
