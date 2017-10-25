import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RaisedButton } from 'material-ui'
import { TextField, Checkbox } from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form/immutable'
import './AddPlatformForm.scss'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'
import { createPlatform } from 'redux/assetsManager/actions'

function prefix (token) {
  return `Assets.AddPlatformForm.${token}`
}

export const FORM_ADD_PLATFORM_DIALOG = 'AddPlatformDialog'

function mapStateToProps (state) {
  const form = state.get('form')
  return {
    formValues: form.get(FORM_ADD_PLATFORM_DIALOG) && form.get(FORM_ADD_PLATFORM_DIALOG).get('values'),
    formErrors: form.get(FORM_ADD_PLATFORM_DIALOG) && form.get(FORM_ADD_PLATFORM_DIALOG).get('syncErrors'),
  }
}

const validate = values => {
  let result = {}

  let platformNameErrors = new ErrorList()
  !values.get('alreadyHave') && platformNameErrors.add(validator.name(values.get('platformName'), true))
  if (platformNameErrors.getErrors()) {
    result.platformName = platformNameErrors.getErrors()
  }

  let platformAddressErrors = new ErrorList()
  values.get('alreadyHave') && platformAddressErrors.add(validator.address(values.get('platformAddress'), true))
  if (platformAddressErrors.getErrors()) {
    result.platformAddress = platformAddressErrors.getErrors()
  }
  return result
}

const onSubmit = (values, dispatch) => {
  dispatch(createPlatform(values))
}

@connect(mapStateToProps)
@reduxForm({form: FORM_ADD_PLATFORM_DIALOG, validate, onSubmit})
export default class AddPlatformForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    formValues: PropTypes.object,
    formErrors: PropTypes.object,
    onSubmitFunc: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
  }

  render () {
    const alreadyHave = this.props.formValues && this.props.formValues.get('alreadyHave')

    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='dialogHeader'>
          <div styleName='dialogHeaderStuff'>
            <div styleName='dialogHeaderTitle'>
              <Translate value={prefix('dialogTitle')} />
            </div>
          </div>
        </div>
        <div styleName='dialogBody'>

          <Field
            disabled={alreadyHave}
            component={TextField}
            name='platformName'
            fullWidth
            floatingLabelText={<Translate value={prefix('platformName')} />}
          />

          <Field
            styleName='checkboxField'
            component={Checkbox}
            name='alreadyHave'
            label={<Translate value={prefix('alreadyHave')} />}
          />

          {
            alreadyHave
              ? <Field
                component={TextField}
                name='platformAddress'
                fullWidth
                floatingLabelText={<Translate value={prefix('platformAddress')} />}
              />
              : null
          }

        </div>
        <div
          styleName='dialogFooter'
        >
          <RaisedButton
            disabled={!!this.props.formErrors}
            styleName='action'
            label={<Translate value={prefix('dialogTitle')} />}
            type='submit'
            primary
          />
        </div>
      </form>
    )
  }
}
