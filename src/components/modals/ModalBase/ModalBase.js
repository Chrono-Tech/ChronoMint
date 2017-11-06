import { Dialog } from 'material-ui'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import styles from './ModalBaseStyles'

export default class ModalBase extends PureComponent {
  static propTypes = {
    modal: PropTypes.bool,
    isNotI18n: PropTypes.bool,
    title: PropTypes.string,
    onClose: PropTypes.func,
    actions: PropTypes.arrayOf(
      PropTypes.node
    ),
    open: PropTypes.bool,
    children: PropTypes.node,
  }

  render () {
    const {modal, title, isNotI18n, onClose, actions, open, children} = this.props
    const isModal = modal !== false
    return (
      <Dialog
        title={
          <div>
            {isNotI18n ? title : <Translate value={title} />}
            <IconButton
              style={styles.closeIcon}
              onTouchTap={onClose}
            >
              <NavigationClose />
            </IconButton>
          </div>
        }
        actions={actions}
        open={open}

        actionsContainerStyle={styles.actionsContainer}
        titleStyle={styles.title}
        contentStyle={styles.content}

        modal={isModal}
        autoScrollBodyContent
      >
        {children}
      </Dialog>
    )
  }
}

