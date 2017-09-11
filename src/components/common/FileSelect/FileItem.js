import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FileModel from 'models/FileSelect/FileModel'
import ArbitraryNoticeModel from 'models/notices/ArbitraryNoticeModel'
import { Translate } from 'react-redux-i18n'
import { CircularProgress } from 'material-ui'
import { download } from 'redux/ui/ipfs'
import { ActionDelete, FileFileDownload } from 'material-ui/svg-icons'
import { notify } from 'redux/notifier/actions'
import FileIcon from './FileIcon'
import globalStyles from 'styles'
import './FileItem.scss'

class FileItem extends Component {
  static propTypes = {
    file: PropTypes.instanceOf(FileModel),
    onRemove: PropTypes.func.isRequired,
    handleDownload: PropTypes.func
  }

  renderErrors () {
    const errors: Array = this.props.file.error()
    return errors.length > 0
      ? (
        <div styleName='errors'>
          {errors.map((item, i) => {
            const value = typeof item === 'string' ? {value: item} : item
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
    if (file.uploaded() || file.hasErrors()) {
      return (
        <div styleName='actionButtons'>
          {file.hasErrors()
            ? null
            : (
              <FileFileDownload
                styleName='buttonItem'
                onTouchTap={() => this.props.handleDownload(file.hash(), file.name())} />
            )
          }
          <ActionDelete
            styleName='buttonItem'
            color={file.hasErrors() ? globalStyles.colors.error : null}
            onTouchTap={() => this.props.onRemove(file.id())} />
        </div>
      )
    }
  }

  render () {
    const file: FileModel = this.props.file

    return (
      <div styleName='root'>
        <div styleName='row'>
          <div styleName={file.hasErrors() ? 'contentWithError' : 'content'}>
            <FileIcon styleName='icon' type={file.icon()} />
            <div styleName='info'>
              <div styleName='name'>{file.name()}</div>
              <div styleName='meta'>{file.size()}</div>
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
    }
  }
}

export default connect(null, mapDispatchToProps)(FileItem)
