import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import { Translate } from 'react-redux-i18n'
import BlacklistForm from 'components/assetsManager/BlacklistForm/BlacklistForm'
import './BlacklistDialog.scss'
import { prefix } from './lang'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class BlacklistDialog extends PureComponent {
  static propTypes = {
    modalsClose: PropTypes.func,
  }

  handleClose = (e) => {
    this.props.modalsClose()
    e.stopPropagation()
  }

  handleSubmitSuccess = () => {
    this.props.modalsClose()
  }

  render () {
    return (
      <ModalDialog>
        <div styleName='content'>
          <div styleName='dialogHeader'>
            <div styleName='dialogHeaderTitle'>
              <Translate value={`${prefix}.dialogTitle`} />
            </div>
            <div styleName='dialogHeaderSubTitle'>
              <Translate value={`${prefix}.dialogSubTitle`} />
            </div>
          </div>
          <div styleName='dialogBody'>
            <BlacklistForm onSubmitSuccess={this.handleSubmitSuccess} />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
