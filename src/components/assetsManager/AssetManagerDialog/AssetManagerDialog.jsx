import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import AssetManagerForm from './AssetManagerForm'

const TRANSITION_TIMEOUT = 250

function mapStateToProps (/*state*/) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    closeModal: () => dispatch(modalsClose()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AssetManagerDialog extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    submitting: PropTypes.bool,
    closeModal: PropTypes.func,
  }

  handleSubmitSuccess = () => {
    this.props.closeModal()
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={TRANSITION_TIMEOUT}
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}
      >
        <ModalDialog onClose={() => this.props.onClose()}>
          <AssetManagerForm
            onSubmitSuccess={this.handleSubmitSuccess}
          />
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}
