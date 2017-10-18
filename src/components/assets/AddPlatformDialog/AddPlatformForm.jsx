import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RaisedButton } from 'material-ui'
import { TextField, Checkbox } from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
import './AddPlatformForm.scss'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

function prefix(token) {
  return `Assets.AddPlatformForm.${token}`
}

export const FORM_ADD_PLATFORM_DIALOG = 'AddPlatformDialog'

function mapStateToProps(state) {
  const form = state.get('form')
  return {
    formValues: form.get(FORM_ADD_PLATFORM_DIALOG) && form.get(FORM_ADD_PLATFORM_DIALOG).get('values'),
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
  if (values.get('alreadyHave')) {
    return {}
  }

  const platformNameErrors = new ErrorList()
  platformNameErrors.add(validator.name(values.get('platformName'), true))

  const platformAddressErrors = new ErrorList()
  platformAddressErrors.add(validator.address(values.get('platformAddress'), true))

  return {
    platformName: platformNameErrors.getErrors(),
    platformAddress: platformAddressErrors.getErrors(),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_ADD_PLATFORM_DIALOG, validate })
export default class AddPlatformForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    formValues: PropTypes.object,
  }

  render() {
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
            !alreadyHave
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
