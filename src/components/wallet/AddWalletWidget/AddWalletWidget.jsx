/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'

import './AddWalletWidget.scss'

export const FORM_ADD_NEW_WALLET = 'FormAddNewWallet'
const STEPS = {
  selectType: 'selectType',
}

function mapStateToProps (state, ownProps) {
  const selector = formValueSelector(FORM_ADD_NEW_WALLET)
  return {
    step: selector(state, 'step'),
    initialValues: {
      step: STEPS.selectType,
    },
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_ADD_NEW_WALLET })
export default class AddWalletWidget extends PureComponent {
  static propTypes = {
    step: PropTypes.string,
    ...formPropTypes,
  }

  renderStep () {
    switch (this.props.step) {
      case STEPS.selectType:
        return <div>select wallet</div>
      default:
        return <div>select wallet</div>
    }
  }

  render () {
    return (
      <form styleName='root'>
        {this.renderStep()}
      </form>
    )
  }
}
