import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { RaisedButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { Field, reduxForm, FieldArray } from 'redux-form/immutable'
import WalletModel from '../../../../models/WalletModel'
import { modalsClose } from 'redux/modals/actions'
import icnWalletDialogWhite from 'assets/img/icn-wallet-dialog-white.svg'
import validate from './validate'
import './WalletAddEditForm.scss'
import OwnersList from 'components/wallet/OwnersList/OwnersList'

export const FORM_WALLET_ADD_EDIT_DIALOG = 'WalletAddEditDialog'

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose())
  }
}

const onSubmit = (values, dispatch, props) => {
  return new WalletModel({
    ...props.initialValues.toJS(),
    ...values.toJS(),
    owners: values.get('owners').toArray().map(item => item.get('address'))
  })
}

@connect(null, mapDispatchToProps)
@reduxForm({form: FORM_WALLET_ADD_EDIT_DIALOG, validate, onSubmit})
export default class WalletAddEditForm extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    isEditMultisig: PropTypes.bool,
    handleSubmit: PropTypes.func,
    initialValues: PropTypes.object,
    pristine: PropTypes.bool,
    valid: PropTypes.bool
  }

  render () {
    const {handleSubmit, pristine, valid, initialValues} = this.props
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
                floatingLabelText={<Translate value='WalletAddEditDialog.walletName' />} />
              <Field
                component={TextField}
                name='requiredSignatures'
                fullWidth
                floatingLabelText={<Translate value='WalletAddEditDialog.requiredSignatures' />} />
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
                floatingLabelText={<Translate value='WalletAddEditDialog.walletName' />} />
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
