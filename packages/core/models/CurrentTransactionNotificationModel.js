/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import uuid from 'uuid/v1'
import AbstractJsModel from './AbstractJsModel'

const schemaFactory = () => ({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  hash: PropTypes.string,
  date: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  details: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any, // used Value component to render
  })),
})

export default class CurrentTransactionNotificationModel extends AbstractJsModel {
  constructor (props) {
    const txDate = typeof props.date === 'number' ? new Date(props.date * 1000) : props.date
    const newProps = { ...props, id: props.id || uuid(), date: txDate }
    super(newProps, schemaFactory())
    Object.assign(this, newProps)
    Object.freeze(this)
  }
}
