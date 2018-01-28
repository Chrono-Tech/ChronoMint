import OwnerItem from 'components/wallet/OwnersList/OwnerItem'
import globalStyles from 'layouts/partials/styles'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { change, Field, formValueSelector, getFormSyncErrors } from 'redux-form/immutable'
import { DUCK_SESSION } from 'redux/session/actions'
import { prefix } from './lang'
import './OwnersList.scss'
import validate from './validate'

const FIELD_NEW_ADDRESS = 'newOwnerAddress'

function mapStateToProps (state, props) {
  const selector = formValueSelector(props.meta.form)
  const errors = getFormSyncErrors(props.meta.form)(state)
  const newOwner = selector(state, FIELD_NEW_ADDRESS)

  return {
    isDisabled: !!errors[ FIELD_NEW_ADDRESS ] || !newOwner,
    newOwner,
    account: state.get(DUCK_SESSION).account,
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    resetForm: () => dispatch(change(props.meta.form, FIELD_NEW_ADDRESS, '')),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class OwnersList extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    resetForm: PropTypes.func,
    newOwner: PropTypes.string,
    fields: PropTypes.object,
    isDisabled: PropTypes.bool,
  }

  handleRemoveItem = (fields, index) => () => fields.remove(index)

  handleAddItem = (fields) => () => {
    fields.push({
      address: this.props.newOwner,
    })
    this.props.resetForm()
  }

  validateOwner = (address) => {
    return validate(address, this.props.fields)
  }

  renderOwners = (fields) => (item, index) => {
    return (
      <OwnerItem
        key={item.address}
        title={<Translate value={`${prefix}.owner`} index={index + 1} />}
        address={item.address}
        onRemove={this.handleRemoveItem(fields, index)}
      />
    )
  }

  render () {
    const { fields, isDisabled, account } = this.props

    return (
      <div>
        <OwnerItem
          title={<Translate value={`${prefix}.you`} />}
          address={account}
          isNoActions
        />
        {fields.getAll().toArray().map(this.renderOwners(fields))}

        <div styleName='addOwner'>
          <div styleName='addOwnerField'>
            <Field
              component={TextField}
              hintText={<Translate value={`${prefix}.floatText`} />}
              hintStyle={globalStyles.textField.hintStyle}
              name={FIELD_NEW_ADDRESS}
              validate={this.validateOwner}
              fullWidth
            />
          </div>
          <div styleName='actions'>
            <button
              styleName='action'
              className='material-icons'
              onTouchTap={!isDisabled && this.handleAddItem(fields)}
              disabled={isDisabled}
            >
              add_circle
            </button>
          </div>
        </div>
      </div>
    )
  }
}
