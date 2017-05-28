import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import globalStyles from '../../styles'
import renderTextField from '../common/renderTextField'
import { declarativeValidator } from '../../utils/validator'
import { I18n } from 'react-redux-i18n'

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
    let errors = declarativeValidator({
      issueAmount: 'required|positive-number'
    })(values)

    if (!errors.issueAmount && (((Number(values.get('issueAmount')) + props.loc.issued()) - props.loc.redeemed()) > props.loc.issueLimit())) {
      errors.sssueAmount = I18n.t('errors.greaterThanAllowed')
    }

    return errors
  }
})
class IssueLHForm extends Component {
  render () {
    const {
      loc
    } = this.props

    return (
      <form name='IssueLHFormName'>
        <div style={globalStyles.modalGreyText}>
          <p>This operation must be co-signed by other CBE key holders before it is executed. Corresponding
            fees will be deducted from this amount</p>
          <p>Allowed to be issued on behalf of {loc.locName}: {loc.issueLimit() - loc.issued()} LHT</p>
        </div>

        <Field component={renderTextField}
          name='issueAmount'
          type='number'
          floatingLabelText='Amount to be issued'
        />

        <Field component={renderTextField} name='address' style={{display: 'none'}} />

        {!this.props.submitting && this.props.error && <div style={{color: '#700'}}>{this.props.error}</div>}
      </form>
    )
  }
}

export default IssueLHForm
