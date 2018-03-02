import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import { RaisedButton } from 'material-ui'
import { Translate } from 'react-redux-i18n'
import styles from 'components/assetsManager/styles'
import './BlockAssetDialog.scss'
import { prefix } from './lang'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class BlockAssetDialog extends PureComponent {
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
              <Translate value={`${prefix}.dialogTitleBlock`} />
            </div>
            <div styleName='dialogHeaderSubTitle'>
              <Translate value={`${prefix}.dialogSubTitleBlock`} />
            </div>
          </div>
          <div styleName='dialogFooter'>
            <RaisedButton
              styleName='action'
              label={<Translate value={`${prefix}.cancel`} />}
              onTouchTap={this.handleClose}
            />
            <RaisedButton
              styleName='action'
              label={<Translate value={`${prefix}.blockAssetButton`} />}
              {...styles.buttons.blockRaisedButton}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
