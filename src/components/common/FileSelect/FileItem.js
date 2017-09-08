import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FileModel from 'models/FileSelect/FileModel'
import { Translate } from 'react-redux-i18n'
import { CircularProgress } from 'material-ui'
import Delete from 'material-ui/svg-icons/action/delete'
import FileIcon from './FileIcon'
import globalStyles from 'styles'
import './FileItem.scss'

class FileItem extends Component {
  static propTypes = {
    file: PropTypes.instanceOf(FileModel),
    onRemove: PropTypes.func.isRequired
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

  renderAction (file: FileModel) {
    if (file.uploading()) {
      return <CircularProgress size={16} thickness={1.5} />
    }
    if (file.uploaded() || file.hasErrors()) {
      return (
        <div styleName='remove'>
          <Delete
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
            {this.renderAction(file)}
          </div>
        </div>
        {this.renderErrors()}
      </div>
    )
  }
}

export default FileItem
