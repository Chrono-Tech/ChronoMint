/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import classnames from 'classnames'
import { CircularProgress } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import ArbitraryNoticeModel from '@chronobank/core/models/notices/ArbitraryNoticeModel'
import FileModel from '@chronobank/core/models/FileSelect/FileModel'
import { download } from 'redux/ui/actions'
import { notify } from '@chronobank/core/redux/notifier/actions'

import './FileItem.scss'

const mapDispatchToProps = (dispatch) => {
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

@connect(null, mapDispatchToProps)
export default class FileItem extends PureComponent {
  static propTypes = {
    file: PropTypes.instanceOf(FileModel),
    onRemove: PropTypes.func.isRequired,
  }

  renderErrors () {
    const errors: Array = this.props.file.error()
    return errors.length > 0
      ? (
        <div styleName='errors'>
          {errors.map((item, i) => {
            const value = typeof item === 'string' ? { value: item } : item
            return <div key={i} styleName='error'><Translate {...value} /></div>
          })}
        </div>
      )
      : null
  }

  renderButtons (file: FileModel) {
    if (file.uploading()) {
      return <CircularProgress size={16} thickness={1.5} />
    }

    const handleDelete = () => () => this.props.onRemove(file.id())

    return (
      <div styleName='actionButtons'>
        {file.hasErrors() || file.uploaded()
          ? (
            <button
              styleName={classnames('buttonItem', { 'errorButton': !!file.hasErrors() })}
              onClick={handleDelete()}
            >
              <i styleName='action-icon' className='chronobank-icon'>delete</i>
            </button>
          )
          : null
        }
      </div>
    )
  }

  render () {
    const file: FileModel = this.props.file

    return (
      <div styleName='root'>
        <div styleName='row'>
          <div styleName={file.hasErrors() ? 'contentWithError' : 'content'}>
            <i styleName='icon' className='chronobank-icon'>file</i>
            <div styleName='info'>
              <div styleName='name'>{file.name()}</div>
            </div>
          </div>
          <div styleName='action'>
            {this.renderButtons(file)}
          </div>
        </div>
        {this.renderErrors()}
      </div>
    )
  }
}
