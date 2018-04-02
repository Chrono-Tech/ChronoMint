import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import RevokeForm, { prefix } from './RevokeForm'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class RevokeDialog extends PureComponent {
  static propTypes = {
    modalsClose: PropTypes.func,
  }

  handleSubmitSuccess = () => {
    this.props.modalsClose()
  }

  render () {
    return (
      <ModalDialog title={<Translate value={prefix('dialogTitle')} />}>
        <RevokeForm onSubmitSuccess={this.handleSubmitSuccess} />
      </ModalDialog>
    )
  }
}
