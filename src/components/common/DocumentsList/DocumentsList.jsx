import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { download } from 'redux/ui/ipfs'
import { notify } from 'redux/notifier/actions'
import FileIcon from 'components/common/FileSelect/FileIcon'
import ArbitraryNoticeModel from 'models/notices/ArbitraryNoticeModel'

import './DocumentsList.scss'

@connect(null, mapDispatchToProps)
export default class DocumentsList extends Component {
  static propTypes = {
    handleDownload: PropTypes.func,
    documents: PropTypes.object, // immutable list
  }

  render() {
    const documents = this.props.documents
      ? this.props.documents.toArray()
      : null

    return (
      <div styleName='root'>
        <div styleName='documents-list'>
          {documents.map((file, index) => (
            <a key={index} styleName='list-item' onTouchTap={() => this.props.handleDownload(file.hash(), file.name())}>
              <FileIcon styleName='item-icon' type={file.icon()} />
              <span styleName='item-title'>{file.name()}</span>
            </a>
          ))}
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
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
