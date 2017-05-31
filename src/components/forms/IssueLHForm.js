import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import validator from './validator'
import globalStyles from '../../styles'
import ErrorList from './ErrorList'
import { TextField } from 'redux-form-material-ui'

const mapStateToProps = state => {
  const loc = state.get('loc')
  return ({
    loc,
    initialValues: {
      address: loc.getAddress(),
      issueAmount: 0
    }
  })
}

const mapDispatchToProps = null
const mergeProps = null
const options = {withRef: true}

@connect(mapStateToProps, mapDispatchToProps, mergeProps, options)
@reduxForm({
  form: 'IssueLHForm',
  validate: (values, props) => {
    const issueAmount = values.get('issueAmount')
    const sssueAmountErrors = new ErrorList()
    sssueAmountErrors.add(validator.required(issueAmount))
    sssueAmountErrors.add(validator.positiveInt(issueAmount))
    if ((Number(issueAmount) + props.loc.issued()) - props.loc.redeemed() > props.loc.issueLimit()) {
      sssueAmountErrors.add('errors.greaterThanAllowed')
    }
    return {
      issueAmount: sssueAmountErrors.getErrors()
    }
  }
})
class IssueLHForm extends Component {
  render () {
    const {
      loc
    } = this.props

    return (
      <form name='IssueLHFormName'>
        <div style={globalStyles.greyText}>
          <p>This operation must be co-signed by other CBE key holders before it is executed. Corresponding
            fees will be deducted from this amount</p>
          <p>Allowed to be issued on behalf of {loc.locName}: {loc.issueLimit() - loc.issued()} LHT</p>
        </div>

        <Field
          component={TextField}
          name='issueAmount'
          type='number'
          floatingLabelText='Amount to be issued'
        />

        <Field
          component={TextField}
          name='address'
          style={{display: 'none'}}
        />

        {!this.props.submitting && this.props.error && <div style={{color: '#700'}}>{this.props.error}</div>}
      </form>
    )
  }
}

export default IssueLHForm
