/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import AddPlatformForm from './AddPlatformForm'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class AddPlatformDialog extends PureComponent {
  static propTypes = {
    modalsClose: PropTypes.func,
  }

  handleSubmitSuccess = () => {
    this.props.modalsClose()
  }

  render () {
    return (
      <ModalDialog>
        <AddPlatformForm onSubmitSuccess={this.handleSubmitSuccess} />
      </ModalDialog>
    )
  }
}
