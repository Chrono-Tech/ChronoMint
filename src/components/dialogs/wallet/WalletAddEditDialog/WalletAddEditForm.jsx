import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { RaisedButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { Field, reduxForm, FieldArray, formPropTypes } from 'redux-form/immutable'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import { modalsClose } from 'redux/modals/actions'
import icnWalletDialogWhite from 'assets/img/icn-wallet-dialog-white.svg'
import OwnersList from 'components/wallet/OwnersList/OwnersList'
import { DUCK_SESSION } from 'redux/session/actions'
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
export default class WalletAddEditForm extends PureComponent {
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
              <Translate value='WalletAddEditDialog.newWallet' />
            </div>
          </div>
        </div>
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
        <div styleName='dialogFooter'>
          <RaisedButton
            styleName='action'
            label={<Translate value='WalletAddEditDialog.addWallet' />}
            type='submit'
            primary
            disabled={pristine || !valid}
          />
        </div>
      </form>
    )
  }
}
