import { Dialog } from 'material-ui'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
// TODO New Modal Stack
/* eslint-disable */
import React from 'react'
import { Translate } from 'react-redux-i18n'

import styles from './ModalBaseStyles'

export default function (props) {
  // true by default
  const isModal = props.modal !== false
  // TODO @dkchv: parse title or set as object {...props.title}
  return (
    <Dialog
      title={
        <div>
          {props.isNotI18n ? props.title : <Translate value={props.title} />}
          <IconButton
            style={styles.closeIcon}
            onTouchTap={props.onClose}
          >
            <NavigationClose />
          </IconButton>
        </div>
      }
      actions={props.actions}
      open={props.open}

      actionsContainerStyle={styles.actionsContainer}
      titleStyle={styles.title}
      contentStyle={styles.content}

      modal={isModal}
      autoScrollBodyContent
    >
      {props.children}
    </Dialog>
  )
}
