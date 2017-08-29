import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import ModalDialog from '../../ModalDialog'
import { modalsClose } from 'redux/modals/actions'

import WalletAddEditForm from './WalletAddEditForm'

const TRANSITION_TIMEOUT = 250

function mapStateToProps (state) {
  return {
    isEditMultisig: state.get('wallet').isEditMultisig,
    isAddNotEdit: state.get('wallet').isAddNotEdit,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => {
      dispatch(modalsClose())
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletAddEditDialog extends React.Component {
  /** @namespace PropTypes.func */
  /** @namespace PropTypes.bool */
  /** @namespace PropTypes.string */
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    isEditMultisig: PropTypes.bool,
    isAddNotEdit: PropTypes.bool,
    locale: PropTypes.string
  }

  static defaultProps = {
    isAddNotEdit: true,
    isEditMultisig: true
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={TRANSITION_TIMEOUT}
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}>
        <ModalDialog onClose={() => this.props.onClose()}>
          <WalletAddEditForm />
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}
