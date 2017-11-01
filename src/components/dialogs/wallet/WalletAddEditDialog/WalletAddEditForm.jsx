import { Field, reduxForm, FieldArray } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import { RaisedButton } from 'material-ui'
import React from 'react'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { formPropTypes } from 'redux-form'
import icnWalletDialogWhite from 'assets/img/icn-wallet-dialog-white.svg'

import MultisigWalletModel from 'models/Wallet/MultisigWalletModel'

import { DUCK_SESSION } from 'redux/session/actions'
import { modalsClose } from 'redux/modals/actions'

import OwnersList from 'components/wallet/OwnersList/OwnersList'

import validate from './validate'

import './WalletAddEditForm.scss'

export const FORM_WALLET_ADD_EDIT_DIALOG = 'WalletAddEditForm'

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
  }
}

function mapStateToProps (state) {
  return {
    account: state.get(DUCK_SESSION).account,
  }
}

const onSubmit = (values, dispatch, props) => {
  return new MultisigWalletModel({
    ...props.initialValues.toJS(),
    ...values.toJS(),
    owners: [
      props.account,
      ...values.get('owners').toArray().map((item) => item.get('address')),
    ],
  })
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_WALLET_ADD_EDIT_DIALOG, validate, onSubmit })
export default class WalletAddEditForm extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  } & formPropTypes

  render () {
    const { handleSubmit, pristine, valid, initialValues } = this.props
    const isNew = initialValues.get('isNew')

    return (
      <form styleName='content' onSubmit={handleSubmit}>
        <div styleName='dialogHeader'>
          <div styleName='dialogHeaderStuff'>
            <img styleName='dialogHeaderIcon' src={icnWalletDialogWhite} />
            <div styleName='dialogHeaderTitle'>
              <Translate
                value={`WalletAddEditDialog.${isNew ? 'newWallet' : 'editWallet'}`}
              />
            </div>
          </div>
        </div>
        {isNew
          ? (
            <div styleName='dialogBody'>
              <Field
                component={TextField}
                name='name'
                fullWidth
                disabled
                floatingLabelText={<Translate value='WalletAddEditDialog.walletName' />}
              />
              <Field
                component={TextField}
                name='requiredSignatures'
                fullWidth
                floatingLabelText={<Translate value='WalletAddEditDialog.requiredSignatures' />}
              />
              <FieldArray
                component={OwnersList}
                name='owners'
              />
            </div>
          )
          : (
            <div styleName='dialogBody'>
              <Field
                component={TextField}
                name='name'
                fullWidth
                floatingLabelText={<Translate value='WalletAddEditDialog.walletName' />}
              />
            </div>
          )
        }
        <div styleName='dialogFooter'>
          <RaisedButton
            styleName='action'
            label={<Translate value={`WalletAddEditDialog.${isNew ? 'addWallet' : 'save'}`} />}
            type='submit'
            primary
            disabled={pristine || !valid}
          />
        </div>
      </form>
    )
  }
}
