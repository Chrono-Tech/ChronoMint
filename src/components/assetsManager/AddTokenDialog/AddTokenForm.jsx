/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { Checkbox, TextField } from 'redux-form-material-ui'
import Select from 'redux-form-material-ui/es/Select'
import { CircularProgress, MenuItem } from '@material-ui/core'
import { Button } from 'components'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import avaToken from 'assets/img/avaToken.svg'
import { change, Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { submit } from 'redux-form'
import classnames from 'classnames'
import colors from 'styles/themes/variables'
import { connect } from 'react-redux'
import icnPlus from 'assets/img/icn-plus.svg'
import platformIcon from 'assets/img/folder-multiple.svg'
import platformIconInCircle from 'assets/img/assets1.svg'
import { ACCEPT_ALL } from '@chronobank/core/models/FileSelect/FileExtension'
import FileModel from '@chronobank/core/models/FileSelect/FileModel'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { I18n } from '@chronobank/core-dependencies/i18n'
import { createAsset, DUCK_ASSETS_MANAGER } from '@chronobank/core/redux/assetsManager/actions'
import { modalsOpen } from 'redux/modals/actions'
import AddPlatformDialog from 'components/assetsManager/AddPlatformDialog/AddPlatformDialog'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import ipfs from '@chronobank/core-dependencies/utils/IPFS'
import FeeModel from '@chronobank/core/models/tokens/FeeModel'
import ReissuableModel from '@chronobank/core/models/tokens/ReissuableModel'
import { FORM_ADD_TOKEN_DIALOG } from 'components/constants'
import validate, { normalizeSmallestUnit } from './validate'

import './AddTokenForm.scss'

export const prefix = (token) => {
  return `Assets.AddTokenForm.${token}`
}

const onSubmit = (values, dispatch) => {
  console.log('onSubmitonSubmit: ', values.toJSON())

  dispatch(createAsset(new TokenModel({
    decimals: values.get('smallestUnit'),
    name: values.get('description'),
    symbol: values.get('tokenSymbol').toUpperCase(),
    balance: values.get('amount'),
    icon: values.get('tokenImg'),
    fee: new FeeModel({
      fee: values.get('feePercent'),
      feeAddress: values.get('feeAddress'),
      withFee: !!values.get('withFee'),
    }),
    platform: values.get('platform'),
    totalSupply: values.get('amount'),
    isReissuable: new ReissuableModel({ value: !!values.get('reissuable') }),
    blockchain: 'Ethereum',
  })))
}

function mapStateToProps (state) {
  const assetsManager = state.get(DUCK_ASSETS_MANAGER)
  const form = state.get('form')
  return {
    formValues: form.get(FORM_ADD_TOKEN_DIALOG) && form.get(FORM_ADD_TOKEN_DIALOG).get('values'),
    formErrors: form.get(FORM_ADD_TOKEN_DIALOG) && form.get(FORM_ADD_TOKEN_DIALOG).get('syncErrors'),
    platformsList: assetsManager.usersPlatforms(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleAddPlatformDialog: () => dispatch(modalsOpen({
      component: AddPlatformDialog,
    })),
    onSubmit: onSubmit,
    submitForm: () => dispatch(submit(FORM_ADD_TOKEN_DIALOG)),
  }
}

// defaults
const DEFAULT_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2Mb
// TODO @dkchv: !!! make as [1,2]
const DEFAULT_ASPECT_RATIO = 2 // means 1:2 ... 2:1
const DEFAULT_MAX_FILES = 10

class Platform extends PureComponent {
  static propTypes = {
    platform: PropTypes.instanceOf(Object),
    selectedPlatform: PropTypes.instanceOf(Object),
    onClick: PropTypes.func,
  }

  handleClick = () => this.props.onClick(this.props.platform)

  render () {
    const { selectedPlatform, platform } = this.props

    return (
      <div
        styleName={classnames('platformItem', { 'selectedPlatform': platform === selectedPlatform })}
        onClick={this.handleClick}
        key={platform.address}
      >
        <div styleName='icon'>
          <img src={platformIconInCircle} alt='' />
        </div>
        {platform.name ?
          <div>{platform.name}&nbsp;(
            <small>{platform.address}</small>
            )
          </div> :
          <div>{platform.address} </div>
        }
      </div>
    )
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_ADD_TOKEN_DIALOG, validate })
export default class AddTokenForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    formValues: PropTypes.object,
    formErrors: PropTypes.object,
    platformsList: PropTypes.array,
    createAsset: PropTypes.func,
    dispatch: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    handleAddPlatformDialog: PropTypes.func,
    maxFiles: PropTypes.number,
    aspectRatio: PropTypes.number,
    maxFileSize: PropTypes.number,
    accept: PropTypes.array,
    ...formPropTypes,
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

  handleAddNewPlatform = () => {
    this.props.onClose()
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

  handleSubmitClick = () => {
    this.setState({ showPlatformError: !this.props.formErrors || !!this.props.formErrors.platform })
    this.props.submitForm()
    console.log('this.props.submitForm: ')
  }

  handleWalletClick = () => {
    this.walletFileUploadInput.click()
  }

  handlePlatformChange = (platform) => {
    this.props.dispatch(change(FORM_ADD_TOKEN_DIALOG, 'platform', platform))
  }

  refWallet = (el) => this.walletFileUploadInput = el

  renderPlatform = (platform) => {
    const selectedPlatform = this.props.formValues && this.props.formValues.get('platform')
    return (
      <Platform
        key={platform.address}
        platform={platform}
        selectedPlatform={selectedPlatform}
        onClick={this.handlePlatformChange}
      />
    )
  }

  renderFileInput () {
    const { isUploading, isUploaded } = this.state
    const tokenImg = this.props.formValues && this.props.formValues.get('tokenImg')
    return (
      <div styleName='tokenImgWrap'>
        {
          !isUploading && !isUploaded && (
            <div styleName='upload' onClick={this.handleWalletClick}>
              <div styleName='uploadContent'><img src={avaToken} alt='' /></div>
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
          onClick={this.handleWalletClick}
          multihash={tokenImg}
        />
        }

        <input
          onChange={(e) => this.handleUploadFile(e)}
          ref={this.refWallet}
          type='file'
          styleName='hide'
        />
      </div>
    )
  }

  renderPlatformsList () {
    const { platformsList, formErrors } = this.props
    return (
      <div styleName='xs-hide'>
        <div styleName='addNewPlatformTitle'>
          <Translate value={prefix('choosePlatform')} />
        </div>
        <div onClick={this.handleAddNewPlatform} styleName='createNewPlatform'>
          <div styleName='icon'>
            <img src={icnPlus} alt='' />
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
              .map(this.renderPlatform)
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
    const renderPlatform = (platform) => {
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
        <div styleName='dialogBody'>

          {this.renderTokenInfo()}

          <Field
            styleName='xs-show'
            name='platform'
            component={Select}
            fullWidth
            placeholder={I18n.t(prefix('choosePlatform'))}
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
                          <img src={platformIcon} alt='' />
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
            placeholder={I18n.t(prefix('tokenSymbol'))}
          />

          <Field
            component={TextField}
            name='description'
            fullWidth
            placeholder={I18n.t(prefix('description'))}
          />

          <div className='AddTokenForm__grid'>
            <div className='row'>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={TextField}
                  name='smallestUnit'
                  fullWidth
                  placeholder={I18n.t(prefix('smallestUnit'))}
                  normalize={normalizeSmallestUnit}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={Checkbox}
                  name='reissuable'
                  label={I18n.t(prefix('reissuable'))}
                />
                <Field
                  component={TextField}
                  name='amount'
                  fullWidth
                  placeholder={I18n.t(prefix('amount'))}
                />
              </div>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={Checkbox}
                  name='withFee'
                  label={I18n.t(prefix('withFee'))}
                />
                <Field
                  disabled={!withFee}
                  component={TextField}
                  name='feeAddress'
                  fullWidth
                  placeholder={I18n.t(prefix('feeAddress'))}
                />
                <Field
                  disabled={!withFee}
                  component={TextField}
                  name='feePercent'
                  fullWidth
                  placeholder={I18n.t(prefix('feePercent'))}
                />
              </div>
            </div>
          </div>
        </div>
        <div styleName='dialogFooter'>
          <Button
            onClick={this.handleSubmitClick}
            styleName='action'
            label={I18n.t(prefix('dialogTitle'))}
            type='button'
          />
        </div>
      </form>
    )
  }
}
