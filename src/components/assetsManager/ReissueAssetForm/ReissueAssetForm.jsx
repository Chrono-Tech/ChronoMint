import { Field, reduxForm, reset } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import { RaisedButton } from 'material-ui'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { reissueAsset } from 'redux/assetsManager/actions'

import './ReissueAssetForm.scss'
import validate from './validate'

function prefix (token) {
  return `Assets.ReissueAssetForm.${token}`
}

const FORM_REISSUE_FORM = 'reissueForm'

function mapStateToProps (state) {
  const assetsManager = state.get('assetsManager')
  return {
    selectedToken: assetsManager.selectedToken,
    tokensMap: assetsManager.tokensMap,
  }
}

const onSubmit = (values, dispatch, props) => {
  dispatch(reissueAsset(props.tokensMap.get(props.selectedToken), values.get('amount')))
  dispatch(reset(FORM_REISSUE_FORM))
}

@connect(mapStateToProps)
@reduxForm({form: FORM_REISSUE_FORM, validate, onSubmit})
export default class ReissueAssetForm extends PureComponent {
  static propTypes = {
    tokensMap: PropTypes.object,
    handleSubmit: PropTypes.func,
    selectedToken: PropTypes.string,
  }

  render () {
    return (
      <div styleName='reissueRow'>
        <form onSubmit={this.props.handleSubmit}>
          <div styleName='input'>
            <Field
              component={TextField}
              fullWidth
              name='amount'
              style={{width: '100%'}}
              floatingLabelText={<Translate value={prefix('reissueAmount')} />}
            />
          </div>
          <RaisedButton
            type='submit'
            primary
            label={<Translate value={prefix('reissue')} />}
            styleName='action'
          />
        </form>
      </div>
    )
  }
}


