/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { TextField, Checkbox } from 'redux-form-material-ui'
import { I18n, Translate } from 'react-redux-i18n'
import { MenuItem } from '@material-ui/core'
import Select from 'redux-form-material-ui/es/Select'
import { createAsset, createPlatformAndAsset } from '@chronobank/core/redux/assetsManager/actions'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import ReissuableModel from '@chronobank/core/models/tokens/ReissuableModel'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import FeeModel from '@chronobank/core/models/tokens/FeeModel'
import { FORM_ADD_NEW_ASSET_ETHEREUM, DUCK_ASSETS_MANAGER } from '@chronobank/core/redux/assetsManager/constants'
import { Field, reduxForm } from 'redux-form/immutable'
import Button from 'components/common/ui/Button/Button'
import estimateFeeAbstract from 'components/dashboard/SendTokens/AbstractEthereum/estimateFeeAbstract'

import './AddEthereumAssetForm.scss'
import { prefix } from './lang'
import validate from './validate'

const onSubmit = async (values, dispatch) => {
  await dispatch(createPlatformAndAsset(values))
}

function mapStateToProps (state) {
  const assetsManager = state.get(DUCK_ASSETS_MANAGER)
  const form = state.get('form').get(FORM_ADD_NEW_ASSET_ETHEREUM)

  return {
    formValues: form && form.get('values'),
    formErrors: (form && form.get('syncErrors')) || {},
    directoryList: assetsManager.usersPlatforms() || [],
    assetTypeList: [{
      name: 'ERC20',
    }, {
      name: 'ERC221',
    }, {
      name: 'ERC721',
    }, {
      name: 'ERC777',
    }],
    gasPriceMultiplier: 1,
    initialValues: {
      directoryNameSelect: 'createNewDirectory',
      directoryName: 'Simple directory name',
      assetType: 'ERC20',
      assetName: 'Asset simple name',
      symbol: 'SBL23',
      smallestUnit: 0.0000001,
      issueAmount: 1111111,
      withFee: false,
    },
  }
}

function mapDispatchToProps () {
  return {
    // onSubmit: onSubmit,
  }
}

@reduxForm({ form: FORM_ADD_NEW_ASSET_ETHEREUM, validate })
@connect(mapStateToProps, mapDispatchToProps)
export default class AddEthereumAssetForm extends estimateFeeAbstract {
  static propTypes = {
    directoryList: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    assetTypeList: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    selectAssetBlockchain: PropTypes.func,
    reset: PropTypes.func,
  }

  componentDidUpdate (prevProps, prevState) {
    super.componentDidUpdate (prevProps, prevState)

    if (this.props.formValues !== prevProps.formValues) {
      try {
        console.log('handleEstimate gas: ', this.props)
        // const { token, recipient, amount, feeMultiplier, wallet } = this.props
        // const value = new Amount(token.addDecimals(amount), this.props.symbol)

        // this.handleEstimateGas(token.symbol(), [recipient, value, TX_TRANSFER], feeMultiplier, wallet.address)
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
      }
    }
  }

  getDirectoryList = () => {
    const directoryList = this.props.directoryList
    return directoryList.concat({
      name: I18n.t(`${prefix}.createNewDirectory`),
      value: 'createNewDirectory',
    })
  }

  render () {
    const { assetTypeList, submitting, handleSubmit } = this.props

    return (
      <div styleName='root'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div styleName='form-container'>
            <div styleName='form-row'>
              <Field
                component={Select}
                name='directoryNameSelect'
                styleName='select-field'
                menu-symbol='symbolSelectorMenu'
                floatingLabelStyle={{ color: 'white' }}
              >
                {this.getDirectoryList().map((directory) => {
                  return (<MenuItem key={directory.name} value={directory.address}>{directory.name || directory.address}</MenuItem>)
                })}
              </Field>
            </div>
            <div styleName='form-row'>
              <Field
                component={TextField}
                name='directoryName'
                placeholder={I18n.t(`${prefix}.directoryName`)}
                fullWidth
              />
            </div>
            <div styleName='form-row'>
              <Field
                component={Select}
                name='assetType'
                styleName='select-field'
                menu-symbol='symbolSelectorMenu'
                floatingLabelStyle={{ color: 'white' }}
              >
                {assetTypeList.map((assetType) => {
                  return (<MenuItem key={assetType.name} value={assetType.name}>{assetType.name}</MenuItem>)
                })}
              </Field>
            </div>
            <div styleName='form-row'>
              <Field
                component={TextField}
                name='assetName'
                placeholder={I18n.t(`${prefix}.assetName`)}
                fullWidth
              />
            </div>
            <div styleName='form-row'>
              <Field
                component={TextField}
                name='symbol'
                placeholder={I18n.t(`${prefix}.symbol`)}
                fullWidth
              />
            </div>
            <div styleName='form-row'>
              <Field
                component={TextField}
                name='smallestUnit'
                placeholder={I18n.t(`${prefix}.smallestUnit`)}
                fullWidth
              />
            </div>
            <div styleName='form-row'>
              <Field
                component={TextField}
                name='issueAmount'
                placeholder={I18n.t(`${prefix}.issueAmount`)}
                fullWidth
              />
            </div>
            <div styleName='form-row'>
              <div styleName='asset-params-container'>
                <div styleName='asset-params-row'>
                  <div styleName='asset-params-cell'>
                    <Field
                      component={Checkbox}
                      name='withFee'
                    />
                  </div>
                  <div styleName='asset-params-cell'>
                    <Field
                      component={TextField}
                      name='transactionFee'
                      placeholder={I18n.t(`${prefix}.transactionFee`)}
                      fullWidth
                    />
                  </div>
                </div>
                <div styleName='asset-params-row'>
                  <div styleName='asset-params-cell'>
                    <Field
                      component={Checkbox}
                      name='reIssable'
                    />
                  </div>
                  <div styleName='asset-params-cell'>
                    <span styleName='asset-params-text'>{I18n.t(`${prefix}.reIssuable`)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div styleName='form-row top-border'>
              {this.simpleFeeContainer()}
            </div>
            <div styleName='form-row top-border'>
              <div styleName='add-container'>
                <Button
                  styleName='button'
                  type='submit'
                  label={<Translate value={`${prefix}.addButton`} />}
                  isLoading={submitting}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
