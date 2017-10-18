import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { RaisedButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
// noinspection JSUnresolvedVariable
import { Field, reduxForm } from 'redux-form/immutable'

import OwnerItem from '../../../wallet/OwnerItem'
import OwnersCount from '../../../wallet/OwnersCount'

import WalletModel from '../../../../models/wallet/WalletModel'

import { modalsClose } from 'redux/modals/actions'

import './WalletAddEditForm.scss'

import icnCirclePlus from 'assets/img/icn-circle-plus.svg'
import icnWalletDialogWhite from 'assets/img/icn-wallet-dialog-white.svg'

import OwnerModel from 'models/wallet/OwnerModel'

export const FORM_WALLET_ADD_EDIT_DIALOG = 'WalletAddEditDialog'

import validator from '../../../forms/validator'
import ErrorList from '../../../forms/ErrorList'

function mapStateToProps(state) {
  return {
    isEditMultisig: state.get('wallet').isEditMultisig,
    isAddNotEdit: state.get('wallet').isAddNotEdit,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => {
      dispatch(modalsClose())
    },
  }
}

const validate = values => {
  const walletNameErrors = new ErrorList()
  walletNameErrors.add(validator.required(values.get('walletName')))
  walletNameErrors.add((typeof values.get('walletName') === 'string') ? null : 'errors.wallet.walletName.haveToBeString')
  const dayLimitErrors = new ErrorList()
  dayLimitErrors.add(validator.required(values.get('dayLimit')))
  dayLimitErrors.add(isNaN(values.get('dayLimit')) ? 'errors.wallet.dayLimit.haveToBeNumber' : null)
  const requiredSignaturesErrors = new ErrorList()
  requiredSignaturesErrors.add(validator.required(values.get('requiredSignatures')))
  requiredSignaturesErrors.add(isNaN(values.get('requiredSignatures')) >= 2 ? null : 'errors.wallet.requiredSignatures.haveToBeMoreThanTwoOrEqual')
  const ownersCountErrors = new ErrorList()
  ownersCountErrors.add(values.get('ownersCount') >= 2 ? null : 'errors.wallet.ownersCount.haveToBeMoreThanTwoOrEqual')
  const errors = {
    walletName: walletNameErrors.getErrors(),
    dayLimit: dayLimitErrors.getErrors(),
    requiredSignatures: requiredSignaturesErrors.getErrors(),
    ownersCount: ownersCountErrors.getErrors(),
  }
  return errors
}

const onSubmit = (values, dispatch, props) => new WalletModel({
  ...props.wallet.toJS(),
  ...values.toJS(),
})

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_WALLET_ADD_EDIT_DIALOG, validate, onSubmit })
export default class WalletAddEditForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      wallet: new WalletModel({
        isNew: true,
        walletName: null,
        dayLimit: null,
        requiredSignatures: null,
      }),
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
    locale: PropTypes.string,
  }

  static defaultProps = {
    isAddNotEdit: true,
    isEditMultisig: true,
  }

  componentWillMount() {
    this.setState({ owners: [], edit: null })
  }

  addOwnerToCollection = () => {
    this.setState({
      wallet: this.state.wallet.addOwner(new OwnerModel({
        ...OwnerModel.genSymbol(),
      })),
    })
  }

  deleteOwnerFromCollection = symbol => {
    this.setState({
      wallet: this.state.wallet.removeOwner(symbol),
    })
  }

  editOwner = owner => {
    this.setState({
      wallet: this.state.wallet.updateOwner(owner.set('editing', true)),
    })
  }

  editOwnerDone = owner => {
    this.setState({
      wallet: this.state.wallet.updateOwner(owner.set('editing', false)),
    })
  }

  render() {
    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='dialogHeader'>
          <div styleName='dialogHeaderStuff'>
            <img styleName='dialogHeaderIcon' src={icnWalletDialogWhite} />
            <div styleName='dialogHeaderTitle'>
              <Translate
                value={(`wallet.walletAddEditDialog.${this.props.isAddNotEdit ? 'newWallet' : 'editWallet'}`)}
              />
            </div>
          </div>
        </div>
        {this.props.isEditMultisig ?
          <div styleName='dialogBody'>
            <Field
              component={TextField}
              name='walletName'
              fullWidth
              floatingLabelText={<Translate value='wallet.walletAddEditDialog.walletName' />}
            />
            <Field
              component={TextField}
              name='dayLimit'
              fullWidth
              floatingLabelText={<Translate value='wallet.walletAddEditDialog.dayLimit' />}
            />
            <Field
              component={TextField}
              name='requiredSignatures'
              fullWidth
              floatingLabelText={<Translate value='wallet.walletAddEditDialog.requiredSignatures' />}
            />
            <Field
              component={OwnersCount}
              name='ownersCount'
              props={{ count: this.state.wallet.ownersCount() }}
            />
            <div styleName='addOwner' onTouchTap={() => { this.addOwnerToCollection() }}>
              <img styleName='addOwnerIcon' src={icnCirclePlus} />
              <div styleName='addOwnerTitle'><Translate value='wallet.walletAddEditDialog.addOwner' /></div>
            </div>
            {this.state.wallet.owners().toArray().map(owner => (<Field
              component={OwnerItem}
              name={`ownerAddress_${owner.symbol()}`}
              owner={owner}
              key={owner.symbol()}
              editOwner={this.editOwner}
              editOwnerDone={this.editOwnerDone}
              deleteOwnerFromCollection={this.deleteOwnerFromCollection}
            />))}
          </div>
          :
          <div styleName='dialogBody'>
            <Field
              component={TextField}
              name='walletName'
              fullWidth
              floatingLabelText={<Translate value='wallet.walletAddEditDialog.walletName' />}
            />
          </div>
        }
        <div
          styleName='dialogFooter'
        >
          <RaisedButton
            styleName='action'
            label={<Translate value={`wallet.walletAddEditDialog.${this.props.isAddNotEdit ? 'addWallet' : 'save'}`} />}
            type='submit'
            primary
            disabled={this.props.submitting}
          />
        </div>
      </form>
    )
  }
}
