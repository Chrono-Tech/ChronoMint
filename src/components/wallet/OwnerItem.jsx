import React from 'react'
import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import validator from '../forms/validator'
import ErrorList from '../forms/ErrorList'

import './OwnerItem.scss'

export default class OwnerItem extends React.Component {
  /** @namespace PropTypes.string */
  /** @namespace PropTypes.func */
  /** @namespace PropTypes.object */
  /** @namespace PropTypes.bool */
  static propTypes = {
    name: PropTypes.string,
    owner: PropTypes.object,
    editOwner: PropTypes.func,
    editOwnerDone: PropTypes.func,
    deleteOwnerFromCollection: PropTypes.func,
    meta: PropTypes.object,
    input: PropTypes.object,
  }

  constructor(props) {
    super(props)
    // noinspection JSUnresolvedVariable
    this.state = {}
  }

  handleChange = ({ target: { value } }) => {
    this.props.input.onChange(value)
  }

  handleBlur = () => {
    this.props.editOwnerDone(this.props.owner)
    this.setState({ touched: true })
  }

  handleFocus = () => {
    this.props.editOwner(this.props.owner)
  }

  getErrors = () => {
    const { value } = this.props.input
    const addressErrors = new ErrorList()
    addressErrors.add(validator.required(value))
    addressErrors.add(validator.address(value))
    return addressErrors.getErrors()
  }

  touchedAndError() {
    return (this.state.touched && this.getErrors())
  }

  touchedAndErrorOrEditing() {
    return this.touchedAndError() || this.props.owner.editing()
  }

  componentDidUpdate() {
    if (!this.state.touched) {
      this.props.editOwner(this.props.owner)
    }
    if (this.props.owner.editing()) {
      document.getElementById(`add_edit_multisig_wallet_input_address_${this.props.owner.symbol()}`).focus()
    }
  }

  render() {
    return (
      <div styleName={this.touchedAndError() ? 'owner error' : 'owner'}>
        <div styleName='ownerIcon'>
          <i className='material-icons'>account_circle</i>
        </div>
        <div styleName='ownerAddressWrapper'>
          <div
            styleName={
              this.touchedAndErrorOrEditing() ? 'hidden' : (this.getErrors() ? 'ownerAddress addressError' : 'ownerAddress')
            }
            onDoubleClick={() => this.props.editOwner(this.props.owner)}
          >{this.props.input.value || this.getErrors()}
          </div>
          <div styleName={this.touchedAndErrorOrEditing() ? 'addressInput' : 'hidden'}>
            <TextField
              style={{ marginTop: '0px', marginBottom: '0px' }}
              fullWidth
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              floatingLabelText={<Translate value='wallet.walletAddEditDialog.ownerAddress' />}
              errorText={this.getErrors()}
              onChange={this.handleChange}
              id={`add_edit_multisig_wallet_input_address_${this.props.owner.symbol()}`}
            />
          </div>
        </div>
        <div styleName='ownerAddressControls'>
          <i
            className='material-icons'
            styleName={this.props.owner.editing() ? 'hidden' : 'pencil'}
            onClick={() => this.props.editOwner(this.props.owner)}
          >edit
          </i>
          <i
            className='material-icons'
            styleName='trash'
            onClick={() => {
              this.props.deleteOwnerFromCollection(this.props.owner.symbol())
            }}
          >delete
          </i>
        </div>
      </div>
    )
  }
}
