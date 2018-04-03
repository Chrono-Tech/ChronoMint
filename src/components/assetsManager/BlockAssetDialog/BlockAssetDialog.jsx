import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import { Translate } from 'react-redux-i18n'
import { changePauseStatus } from 'redux/assetsManager/actions'
import TokenModel from 'models/tokens/TokenModel'
import { Button } from 'components'
import './BlockAssetDialog.scss'
import { prefix } from './lang'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
    handleBlockAsset: (token: TokenModel) => dispatch(changePauseStatus(token, true)),
    handleUnblockAsset: (token: TokenModel) => dispatch(changePauseStatus(token, false)),
  }
}

@connect(null, mapDispatchToProps)
export default class BlockAssetDialog extends PureComponent {
  static propTypes = {
    modalsClose: PropTypes.func,
    handleBlockAsset: PropTypes.func,
    handleUnblockAsset: PropTypes.func,
    token: PropTypes.instanceOf(TokenModel),
  }

  handleClose = (e) => {
    this.props.modalsClose()
    e.stopPropagation()
  }

  handleSubmitSuccess = () => {
    this.props.modalsClose()
  }

  handleBlockAsset = () => {
    this.props.modalsClose()
    this.props.handleBlockAsset(this.props.token)
  }

  handleUnblockAsset = () => {
    this.props.modalsClose()
    this.props.handleUnblockAsset(this.props.token)
  }

  render () {
    const isPaused = this.props.token.isPaused().value()
    return (
      <ModalDialog>
        <div styleName='content'>
          <div styleName='dialogHeader'>
            <div styleName='dialogHeaderTitle'>
              <Translate value={`${prefix}.${isPaused ? 'dialogTitleUnblock' : 'dialogTitleBlock'}`} />
            </div>
            <div styleName='dialogHeaderSubTitle'>
              <Translate value={`${prefix}.${isPaused ? 'dialogSubTitleUnblock' : 'dialogSubTitleBlock'}`} />
            </div>
          </div>
          <div styleName='dialogFooter'>
            <Button
              styleName='action'
              label={<Translate value={`${prefix}.cancel`} />}
              onTouchTap={this.handleClose}
            />
            {isPaused
              ? <Button
                styleName='action'
                label={<Translate value={`${prefix}.unblockAssetButton`} />}
                onTouchTap={this.handleUnblockAsset}
              />
              : <Button
                styleName='action block'
                label={<Translate value={`${prefix}.blockAssetButton`} />}
                onTouchTap={this.handleBlockAsset}
              />
            }
          </div>
        </div>
      </ModalDialog>
    )
  }
}
