import { FlatButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { TextField } from 'redux-form-material-ui'
import { change, Field, formValueSelector, getFormSyncErrors } from 'redux-form/immutable'
import { DUCK_SESSION } from 'redux/session/actions'
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

  renderOwners = (fields) => (item, index) => {
    const address = fields.get(index).address
    return (
      <div key={address}>
        addr: {address}
        <FlatButton
          icon={<i className='material-icons'>delete</i>}
          onTouchTap={this.handleRemoveItem(fields, index)}
          fullWidth
        />
      </div>
    )
  }

  render () {
    const { fields, isDisabled } = this.props

    return (
      <div>
        {fields.getAll().toArray().map(this.renderOwners(fields))}

        <Field
          component={TextField}
          name={FIELD_NEW_ADDRESS}
          validate={validate}
        />
        <FlatButton
          label='add'
          onTouchTap={!isDisabled && this.handleAddItem(fields)}
          disabled={isDisabled}
        />
      </div>
    )
  }
}
