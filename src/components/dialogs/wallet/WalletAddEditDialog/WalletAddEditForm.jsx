import icnWalletDialogWhite from 'assets/img/icn-wallet-dialog-white.svg'
import OwnersList from 'components/wallet/OwnersList/OwnersList'
import { RaisedButton } from 'material-ui'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import OwnerCollection from 'models/wallet/OwnerCollection'
import OwnerModel from 'models/wallet/OwnerModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { Field, FieldArray, formPropTypes, reduxForm } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
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
  const owners = values.get('owners')
  let ownersCollection = new OwnerCollection()
  ownersCollection = ownersCollection.add(new OwnerModel({
    address: props.account,
  }))
  owners.forEach((owner) => {
    ownersCollection = ownersCollection.add(new OwnerModel({
      address: owner.get('address'),
    }))
  })
  return new MultisigWalletModel({
    ...props.initialValues.toJS(),
    ...values.toJS(),
    owners: ownersCollection,
    // owners: [
    //   props.account,
    //   ...values.get('owners').toArray().map((item) => item.get('address')),
    // ],
  })
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_WALLET_ADD_EDIT_DIALOG, validate, onSubmit })
export default class WalletAddEditForm extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    ...formPropTypes,
  }

  render () {
    const { handleSubmit, pristine, valid } = this.props

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
