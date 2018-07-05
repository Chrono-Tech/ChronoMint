/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractJsModel from './AbstractJsModel'

const schemaFactory = () => ({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date),
  details: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any, // used Value component to render
  })),
})

export default class CurrentTransactionNotificationModel extends AbstractJsModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }
}
