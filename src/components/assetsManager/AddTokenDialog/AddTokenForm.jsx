import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CircularProgress, RaisedButton, MenuItem } from 'material-ui'
import { TextField, Checkbox, SelectField } from 'redux-form-material-ui'
import { modalsOpen } from 'redux/modals/actions'
import AddPlatformDialog from 'components/assetsManager/AddPlatformDialog/AddPlatformDialog'
import { Field, reduxForm, change } from 'redux-form/immutable'
import { createAsset } from 'redux/assetsManager/actions'
import './AddTokenForm.scss'
import validate from './validate'
import BigNumber from 'bignumber.js'
import colors from 'styles/themes/variables'
import classnames from 'classnames'
import ipfs from 'utils/IPFS'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import FileModel from 'models/FileSelect/FileModel'
import { ACCEPT_ALL } from 'models/FileSelect/FileExtension'

function prefix (token) {
  return `Assets.AddTokenForm.${token}`
}

export const FORM_ADD_TOKEN_DIALOG = 'AddTokenDialog'

function mapStateToProps (state) {
  const assetsManager = state.get('assetsManager')
  const form = state.get('form')
  return {
    formValues: form.get(FORM_ADD_TOKEN_DIALOG) && form.get(FORM_ADD_TOKEN_DIALOG).get('values'),
    formErrors: form.get(FORM_ADD_TOKEN_DIALOG) && form.get(FORM_ADD_TOKEN_DIALOG).get('syncErrors'),
    platformsList: assetsManager.usersPlatforms,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleAddPlatformDialog: () => dispatch(modalsOpen({
      component: AddPlatformDialog,
    })),
    createAsset: (values) => dispatch(createAsset(values)),
  }
}

const onSubmit = (values, dispatch) => {
  dispatch(createAsset(values))
}

// defaults
const DEFAULT_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2Mb
// TODO @dkchv: !!! make as [1,2]
const DEFAULT_ASPECT_RATIO = 2 // means 1:2 ... 2:1
const DEFAULT_MAX_FILES = 10

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_ADD_TOKEN_DIALOG, validate, onSubmit })
export default class AddTokenForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    formValues: PropTypes.object,
    formErrors: PropTypes.object,
    platformsList: PropTypes.array,
    createAsset: PropTypes.func,
    dispatch: PropTypes.func,
    handleClose: PropTypes.func,
    handleAddPlatformDialog: PropTypes.func,
    maxFiles: PropTypes.number,
    aspectRatio: PropTypes.number,
    maxFileSize: PropTypes.number,
    accept: PropTypes.array,
  }

  constructor (props) {
    super(...arguments)
    this.state = {
      isUploading: false,
      isUploaded: false,
      showPlatformError: false,
      config: {
        accept: props.accept || ACCEPT_ALL,
        maxFileSize: props.maxFileSize || DEFAULT_MAX_FILE_SIZE,
        aspectRatio: props.aspectRatio || DEFAULT_ASPECT_RATIO,
        maxFiles: props.maxFiles || DEFAULT_MAX_FILES,
      },

    }
  }

  handleAddNewPlatform () {
    this.props.handleClose()
    this.props.handleAddPlatformDialog()
  }

  async handleFileUploaded (file) {
    this.setState({
      isUploading: false,
      isUploaded: true,
    })
    this.props.dispatch(change(FORM_ADD_TOKEN_DIALOG, 'tokenImg', file.hash()))
  }

  async handleUploadFile (e) {
    const file = e.target.files[0]
    if (!file) {
      return
    }
    this.setState({
      isUploading: true,
    })
    await ipfs.uploadFile(
      new FileModel({ file, uploading: true }),
      this.state.config,
      (file) => this.handleFileUploaded(file))
  }

  renderFileInput () {
    const { isUploading, isUploaded } = this.state
    const tokenImg = this.props.formValues && this.props.formValues.get('tokenImg')
    return (<div styleName='tokenImgWrap'>
      {
        !isUploading && !isUploaded && (
          <div styleName='upload' onTouchTap={() => this.walletFileUploadInput.click()}>
            <div styleName='uploadContent'><img src={require('assets/img/avaToken.svg')} alt='' /></div>
          </div>
        )
      }

      {isUploading && (
        <div styleName='progress'>
          <CircularProgress
            size={16}
            color={colors.colorPrimary1}
            thickness={1.5}
          />
          <span styleName='progressText'>{<Translate value={prefix('uploading')} />}</span>
        </div>
      )}

      {!isUploading && isUploaded &&
      <IPFSImage
        styleName='tokenImg'
        onTouchTap={() => this.walletFileUploadInput.click()}
        multihash={tokenImg}
      />
      }

      <input
        onChange={(e) => this.handleUploadFile(e)}
        ref={(input) => this.walletFileUploadInput = input}
        type='file'
        styleName='hide'
      />
    </div>)
  }

  renderPlatformsList () {
    const selectedPlatform = this.props.formValues && this.props.formValues.get('platform')
    const { platformsList, dispatch, formErrors } = this.props
    return (
      <div styleName='xs-hide'>
        <div styleName='addNewPlatformTitle'>
          <Translate value={prefix('choosePlatform')} />
        </div>
        <div onTouchTap={() => this.handleAddNewPlatform()} styleName='createNewPlatform'>
          <div styleName='icon'>
            <img src={require('assets/img/icn-plus.svg')} alt='' />
          </div>
          <Translate value={prefix('addNewPlatform')} />
        </div>
        {
          this.state.showPlatformError && formErrors && formErrors.platform &&
          <div styleName='error'><Translate value={prefix('platformError')} /></div>
        }
        <div styleName='platformsList'>
          {
            platformsList
              .map((platform) => {
                return (<div
                  styleName={classnames('platformItem', { 'selectedPlatform': platform === selectedPlatform })}
                  onTouchTap={() => dispatch(change(FORM_ADD_TOKEN_DIALOG, 'platform', platform))}
                  key={platform.address}
                >
                  <div styleName='icon'>
                    <img src={require('assets/img/assets1.svg')} alt='' />
                  </div>
                  {
                    platform.name
                      ? <div>{platform.name}&nbsp;(
                        <small>{platform.address}</small>
                        )
                      </div>
                      : <div>{platform.address} </div>
                  }
                </div>)
              })
          }
        </div>
      </div>
    )
  }

  renderTokenInfo () {
    const tokenSymbol = this.props.formValues && this.props.formValues.get('tokenSymbol')
    const smallestUnit = this.props.formValues && this.props.formValues.get('smallestUnit')
    const amount = this.props.formValues && this.props.formValues.get('amount')
    const description = this.props.formValues && this.props.formValues.get('description')
    const platform = this.props.formValues && this.props.formValues.get('platform')
    const renderPlatform = platform => {
      return platform.name
        ? <span>{platform.name}&nbsp;(<small>{platform.address}</small>)</span>
        : <span>{platform.address}</span>
    }
    return (
      <div styleName='tokenInfoRow'>
        {this.renderFileInput()}
        <div styleName='info'>
          <div styleName='name'>
            {
              description ||
              <Translate value={prefix('description')} />}&nbsp;(
            {
              tokenSymbol ||
              <Translate value={prefix('tokenSymbol')} />
            })
          </div>
          <div>
            <span styleName='layer'>{new BigNumber(amount || 0).toFixed(smallestUnit || 0)}</span>
            <span styleName='symbol'>{tokenSymbol || <Translate value={prefix('tokenSymbol')} />}</span>
          </div>
          <div styleName='platform'>
            <div styleName='subTitle'>
              <Translate value={prefix('platformName')} />
            </div>
            <div styleName='number'>
              {
                platform
                  ? renderPlatform(platform)
                  : <Translate value={prefix('PlatformNotSelected')} />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const withFee = this.props.formValues && this.props.formValues.get('withFee')
    const { platformsList } = this.props

    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='dialogHeader'>
          <div styleName='dialogHeaderStuff'>
            <div styleName='dialogHeaderTitle'>
              <Translate value={prefix('dialogTitle')} />
            </div>
          </div>
        </div>
        <div styleName='dialogBody'>

          {this.renderTokenInfo()}

          <Field
            styleName='xs-show'
            name='platform'
            component={SelectField}
            fullWidth
            floatingLabelFixed
            floatingLabelText={<Translate value={prefix('choosePlatform')} />}
          >
            {
              platformsList
                .map((platform) => {
                  return (<MenuItem
                    key={platform.address}
                    value={platform}
                    primaryText={
                      <span styleName='platformSelectorItem'>
                        <span>
                          <img src={require('assets/img/folder-multiple.svg')} alt='' />
                          {platform.name}&nbsp;(<small>{platform.address}</small>)
                        </span>
                      </span>
                    }
                  />)
                })}
          </Field>
          {this.renderPlatformsList()}
          <Field
            component={TextField}
            name='tokenSymbol'
            fullWidth
            floatingLabelText={<Translate value={prefix('tokenSymbol')} />}
          />

          <Field
            component={TextField}
            name='description'
            fullWidth
            floatingLabelText={<Translate value={prefix('description')} />}
          />

          <div className='AddTokenForm__grid'>
            <div className='row'>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={TextField}
                  name='smallestUnit'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('smallestUnit')} />}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={Checkbox}
                  name='reissuable'
                  label={<Translate value={prefix('reissuable')} />}
                />
                <Field
                  component={TextField}
                  name='amount'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('amount')} />}
                />
              </div>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={Checkbox}
                  name='withFee'
                  label={<Translate value={prefix('withFee')} />}
                />
                <Field
                  disabled={!withFee}
                  component={TextField}
                  name='feeAddress'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('feeAddress')} />}
                />
                <Field
                  disabled={!withFee}
                  component={TextField}
                  name='feePercent'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('feePercent')} />}
                />
              </div>
            </div>
          </div>

          {/*<Field
            styleName='checkboxField'
            component={Checkbox}
            name='startWithCrowdsale'
            label={<Translate value={prefix('startWithCrowdsale')} />}
          />*/}

        </div>
        <div
          styleName='dialogFooter'
        >
          <RaisedButton
            onTouchTap={() => {
              this.setState({ showPlatformError: !!this.props.formErrors.platform })
            }}
            styleName='action'
            label={<Translate value={prefix('dialogTitle')} />}
            type='submit'
            primary
          />
        </div>
      </form>
    )
  }
}
