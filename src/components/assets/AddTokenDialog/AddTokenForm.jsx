import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CircularProgress, RaisedButton, MenuItem } from 'material-ui'
import { TextField, Checkbox, SelectField } from 'redux-form-material-ui'
import { modalsOpen } from 'redux/modals/actions'
import AddPlatformDialog from 'components/assets/AddPlatformDialog/AddPlatformDialog'
import { Field, reduxForm, change } from 'redux-form/immutable'
import { createAsset } from 'redux/AssetsManager/actions'
import './AddTokenForm.scss'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'
import { TokenValue } from 'components'
import BigNumber from 'bignumber.js'
import colors from 'styles/themes/variables'
import classnames from 'classnames'

function prefix (token) {
  return 'Assets.AddTokenForm.' + token
}

export const FORM_ADD_TOKEN_DIALOG = 'AddTokenDialog'

function mapStateToProps (state) {
  const assetsManager = state.get('assetsManager')
  const form = state.get('form')
  return {
    formValues: form.get(FORM_ADD_TOKEN_DIALOG) && form.get(FORM_ADD_TOKEN_DIALOG).get('values'),
    formErrors: form.get(FORM_ADD_TOKEN_DIALOG) && form.get(FORM_ADD_TOKEN_DIALOG).get('syncErrors'),
    platformsList: assetsManager.platformsList
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleAddPlatformDialog: () => dispatch(modalsOpen({
      component: AddPlatformDialog
    })),
    createAsset: (values) => dispatch(createAsset(values))
  }
}

const validate = (values) => {
  let tokenSymbolErrors = new ErrorList()
  tokenSymbolErrors.add(validator.required(values.get('tokenSymbol')))

  let descriptionErrors = new ErrorList()
  descriptionErrors.add(validator.required(values.get('description')))

  let smallestUnitErrors = new ErrorList()
  smallestUnitErrors.add(validator.positiveNumber(values.get('smallestUnit')))
  smallestUnitErrors.add(validator.required(values.get('smallestUnit')))

  let amountErrors = new ErrorList()
  if (values.get('reissuable')) {
    amountErrors.add(validator.positiveNumber(values.get('amount')))
    amountErrors.add(validator.required(values.get('amount')))
  }

  let feePercentErrors = new ErrorList()
  let feeAddressErrors = new ErrorList()
  if (values.get('withFee')) {
    feePercentErrors.add(validator.positiveNumber(values.get('feePercent')))
    feePercentErrors.add(validator.required(values.get('feePercent')))
    feeAddressErrors.add(validator.address(values.get('feeAddress'), true))
  }

  return {
    tokenSymbol: tokenSymbolErrors.getErrors(),
    description: descriptionErrors.getErrors(),
    smallestUnit: smallestUnitErrors.getErrors(),
    amount: amountErrors.getErrors(),
    feePercent: feePercentErrors.getErrors(),
    feeAddress: feeAddressErrors.getErrors()
  }
}


const onSubmit = (values, dispatch) => {
  dispatch(createAsset(values))
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({form: FORM_ADD_TOKEN_DIALOG, validate, onSubmit})
export default class AddPlatformForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    formValues: PropTypes.object,
    formErrors: PropTypes.object,
    platformsList: PropTypes.array,
    createAsset: PropTypes.func,
    dispatch: PropTypes.func,
    handleClose: PropTypes.func,
    handleAddPlatformDialog: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      isUploading: false,
      isUploaded: false,
      tokenImg: null
    }
  }

  handleAddNewPlatform () {
    this.props.handleClose()
    this.props.handleAddPlatformDialog()
  }

  handleFileUploaded = (e) => {
    this.setState({
      isUploading: false,
      isUploaded: true,
      tokenImg: e.target.result
    })
  }

  handleUploadFile = (e) => {
    const file = e.target.files[0]
    if (!file) {
      return
    }
    this.setState({
      isUploading: true,
      fileName: file.name
    })
    const reader = new FileReader()
    reader.onload = this.handleFileUploaded
    reader.readAsDataURL(file)
  }

  renderFileInput () {
    const {tokenImg, isUploading, isUploaded} = this.state

    return <div styleName='tokenImgWrap'>
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
            thickness={1.5} />
          <span styleName='progressText'>{<Translate value={prefix('uploading')} />}</span>
        </div>
      )}

      {!isUploading && isUploaded && <img
        onTouchTap={() => this.walletFileUploadInput.click()}
        styleName='tokenImg'
        src={tokenImg}
        alt='token img' />}

      <input
        onChange={this.handleUploadFile}
        ref={(input) => this.walletFileUploadInput = input}
        type='file'
        styleName='hide'
      />
    </div>
  }

  renderPlatformsList () {
    const selectedPlatform = this.props.formValues && this.props.formValues.get('platform')
    const {platformsList, dispatch} = this.props
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
        <div styleName='platformsList'>
          {
            platformsList
              .map(platform => {
                return <div
                  styleName={classnames('platformItem', {'selectedPlatform': platform === selectedPlatform})}
                  onTouchTap={() => dispatch(change(FORM_ADD_TOKEN_DIALOG, 'platform', platform))}
                  key={platform}>
                  <div styleName='icon'>
                    <img src={require('assets/img/assets1.svg')} alt='' />
                  </div>
                  <div>{platform}</div>
                </div>
              })
          }
        </div>
      </div>
    )
  }


  render () {
    const withFee = this.props.formValues && this.props.formValues.get('withFee')
    const reissuable = this.props.formValues && this.props.formValues.get('reissuable')
    const tokenSymbol = this.props.formValues && this.props.formValues.get('tokenSymbol')
    const smallestUnit = this.props.formValues && this.props.formValues.get('smallestUnit')
    const description = this.props.formValues && this.props.formValues.get('description')
    const platform = this.props.formValues && this.props.formValues.get('platform')
    const {formErrors, platformsList} = this.props

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

          <div styleName='tokenInfoRow'>
            {this.renderFileInput()}
            <div styleName='info'>
              <div styleName='name'>
                {description || <Translate value={prefix('description')} />}
              </div>
              {
                tokenSymbol && !formErrors.tokenSymbol && smallestUnit && !formErrors.smallestUnit
                  ? <TokenValue
                    style={{fontSize: '16px', lineHeight: '30px'}}
                    value={new BigNumber(smallestUnit)}
                    symbol={tokenSymbol}
                  />
                  : null
              }

              {
                platform && <div styleName='platform'>
                  <div styleName='subTitle'>
                    <Translate value={prefix('platformName')} />
                  </div>
                  <div styleName='number'>
                    <span>{platform}</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <Field
            styleName='xs-show'
            name='platform'
            component={SelectField}
            fullWidth
            floatingLabelFixed
            floatingLabelText={<Translate value={prefix('choosePlatform')} />}>
            {
              platformsList
                .map(platform => {
                  return <MenuItem
                    key={platform} value={platform}
                    primaryText={<span styleName='platformSelectorItem'>
                      <span>
                        <img src={require('assets/img/folder-multiple.svg')} alt='' />
                        {platform}
                      </span>
                    </span>
                    } />
                })}
          </Field>
          {this.renderPlatformsList()}
          <Field
            component={TextField}
            name='tokenSymbol'
            fullWidth
            floatingLabelText={<Translate value={prefix('tokenSymbol')} />} />

          <Field
            component={TextField}
            name='description'
            fullWidth
            floatingLabelText={<Translate value={prefix('description')} />} />

          <div className='AddTokenForm__grid'>
            <div className='row'>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={TextField}
                  name='smallestUnit'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('smallestUnit')} />} />
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={Checkbox}
                  name='reissuable'
                  label={<Translate value={prefix('reissuable')} />} />
                <Field
                  disabled={!reissuable}
                  component={TextField}
                  name='amount'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('amount')} />} />
              </div>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={Checkbox}
                  name='withFee'
                  label={<Translate value={prefix('withFee')} />} />
                <Field
                  disabled={!withFee}
                  component={TextField}
                  name='feeAddress'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('feeAddress')} />} />
                <Field
                  disabled={!withFee}
                  component={TextField}
                  name='feePercent'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('feePercent')} />} />
              </div>
            </div>
          </div>

          <Field
            styleName='checkboxField'
            component={Checkbox}
            name='startWithCrowdsale'
            label={<Translate value={prefix('startWithCrowdsale')} />} />

        </div>
        <div
          styleName='dialogFooter'>
          <RaisedButton
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
