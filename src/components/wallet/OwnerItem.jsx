import React from 'react'
import PropTypes from 'prop-types'
import { I18n } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import validator from '../forms/validator'

import './OwnerItem.scss'

class OwnerItem extends React.Component {
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
    input: PropTypes.object
  }

  state = {}

  constructor (props) {
    super(props)
  }

  handleChange = ({target: {value}}) => {
    this.props.input.onChange(value)
  }

  handleBlur = () => {
    this.props.editOwnerDone(this.props.owner)
    this.setState({touched: true})
  }

  static validate (value) {
    return validator.address(value)
  }

  getError () {
    return this.props.meta.error || validator.address(this.props.input.value)
  }

  touchedAndError () {
    return this.state.touched && this.getError()
  }

  touchedAndErrorOrEditing () {
    return this.touchedAndError() || this.props.owner.editing()
  }

  componentDidUpdate () {
    if (!this.state.touched) {
      this.props.editOwner(this.props.owner)
    }
    if (this.props.owner.editing()) {
      document.getElementById('add_edit_multisig_wallet_input_address_' + this.props.owner.symbol()).focus()
    }
  }

  render () {
    return (
      <div styleName={this.touchedAndError() ? 'owner err' : 'owner'}>
        <div styleName='ownerIcon'>
          <i className='material-icons'>account_circle</i>
        </div>
        <div styleName='ownerAddressWrapper'>
          <div
            styleName={this.touchedAndErrorOrEditing() ? 'hidden' : 'ownerAddress'}
            onDoubleClick={() => this.props.editOwner(this.props.owner)}
          >{this.props.input.value || I18n.t('wallet.walletAddEditDialog.ownerAddress')}
          </div>
          <div styleName={this.touchedAndErrorOrEditing() ? 'addressInput' : 'hidden'}>
            <TextField
              style={{marginTop: '0px', marginBottom: '0px'}}
              fullWidth
              onBlur={this.handleBlur}
              floatingLabelText={I18n.t('wallet.walletAddEditDialog.ownerAddress')}
              errorText={this.touchedAndError() ? I18n.t(this.getError()) : null}
              onChange={this.handleChange}
              id={'add_edit_multisig_wallet_input_address_' + this.props.owner.symbol()}
            />
          </div>
        </div>
        <div styleName='ownerAddressControls'>
          <i className='material-icons' styleName={this.props.owner.editing() ? 'hidden' : 'pencil'}
            onClick={() => this.props.editOwner(this.props.owner)}>edit</i>
          <i className='material-icons' styleName='trash' onClick={() => {
            this.props.deleteOwnerFromCollection(this.props.owner.symbol())
          }}>delete</i>
        </div>
      </div>
    )
  }
}

export default OwnerItem
