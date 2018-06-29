/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ArbitraryNoticeModel from '@chronobank/core/models/notices/ArbitraryNoticeModel'
import { download } from 'redux/ui/actions'
import { notify } from '@chronobank/core/redux/notifier/actions'
import FileIcon from 'components/common/FileSelect/FileIcon'

import './DocumentsList.scss'

@connect(null, mapDispatchToProps)
export default class DocumentsList extends PureComponent {
  static propTypes = {
    handleDownload: PropTypes.func,
    documents: PropTypes.object, // immutable list
  }

  render () {
    const documents = this.props.documents
      ? this.props.documents.toArray()
      : null

    return (
      <div styleName='root'>
        <div styleName='documents-list'>
          {documents.map((file, index) => (
            <a key={index} styleName='list-item' onClick={() => this.props.handleDownload(file.hash(), file.name())}>
              <i styleName='item-icon' className='chronobank-icon'>file</i>
              <span styleName='item-title'>{file.name()}</span>
            </a>
          ))}
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDownload: (hash, name) => {
      try {
        dispatch(notify(new ArbitraryNoticeModel({ key: 'notices.downloads.started', params: { name } }), false))
        dispatch(download(hash, name))
        dispatch(notify(new ArbitraryNoticeModel({ key: 'notices.downloads.completed', params: { name } }), true))
      } catch (e) {
        dispatch(notify(new ArbitraryNoticeModel({ key: 'notices.downloads.failed', params: { name } }), false))
      }
    },
  }
}
