/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { TextField, Checkbox } from 'redux-form-material-ui'
import { I18n, Translate } from 'react-redux-i18n'
import { FormControlLabel, MenuItem } from '@material-ui/core'
import Select from 'redux-form-material-ui/es/Select'
import { FEE_RATE_MULTIPLIER } from '@chronobank/core/redux/wallets/constants'
import { FORM_ADD_NEW_ASSET_ETHEREUM } from '@chronobank/core/redux/assetsManager/constants'
import Slider from 'components/common/Slider'
import { Field, reduxForm } from 'redux-form/immutable'
import Button from 'components/common/ui/Button/Button'

import './AddEthereumAssetForm.scss'
import { prefix } from './lang'

function mapStateToProps (state) {
  return {
    directoryList: [{
      name: 'Getting Started',
    }, {
      name: 'Another directory',
    }],
    assetTypeList: [{
      name: 'ERC20',
    }, {
      name: 'ERC221',
    }, {
      name: 'ERC721',
    }, {
      name: 'ERC777',
    }],
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

@reduxForm({ form: FORM_ADD_NEW_ASSET_ETHEREUM })
@connect(mapStateToProps, mapDispatchToProps)
export default class AddEthereumAssetForm extends PureComponent {
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

  getDirectoryList = () => {
    const directoryList = this.props.directoryList

    return directoryList.concat({
      name: I18n.t(`${prefix}.createNewDirectory`),
      value: 'createNewDirectory',
    })
  }

  render () {
    const { directoryList, assetTypeList, submitting } = this.props

    return (
      <div styleName='root'>
        <form onSubmit={this.handleFormSubmit}>
          <div styleName='form-container'>
            <div styleName='form-row'>
              <Field
                component={Select}
                name='directory-name-select'
                styleName='select-field'
                menu-symbol='symbolSelectorMenu'
                floatingLabelStyle={{ color: 'white' }}
              >
                {directoryList.map((directory) => {
                  return (<MenuItem key={directory.name} value={directory.name}>{directory.name}</MenuItem>)
                })}
              </Field>
            </div>
            <div styleName='form-row'>
              <Field
                component={TextField}
                name='directory-name'
                placeholder={I18n.t(`${prefix}.directoryName`)}
                fullWidth
              />
            </div>
            <div styleName='form-row'>
              <Field
                component={Select}
                name='asset-type'
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
                name='asset-name'
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
                name='smallest-unit'
                placeholder={I18n.t(`${prefix}.smallestUnit`)}
                fullWidth
              />
            </div>
            <div styleName='form-row'>
              <Field
                component={TextField}
                name='issue-amount'
                placeholder={I18n.t(`${prefix}.issueAmount`)}
                fullWidth
              />
            </div>
            <div styleName='form-row'>
              <div styleName='transaction-fee-container'>
                <div styleName='transaction-fee-checkbox'>
                  <Field
                    component={Checkbox}
                    name='transaction-fee-enable'
                  />
                </div>
                <div styleName='transaction-fee-text'>
                  <Field
                    component={TextField}
                    name='transaction-fee'
                    placeholder={I18n.t(`${prefix}.transactionFee`)}
                    fullWidth
                  />
                </div>
              </div>
            </div>
            <div styleName='form-row'>
              <FormControlLabel
                control={
                  <Field
                    component={Checkbox}
                    name='re-issue'
                  />
                }
                label='Re-issuable on issue amount reached'
              />
            </div>
            <div styleName='form-row top-border'>
              <div styleName='feeRate'>
                <div styleName='tagsWrap'>
                  <div><Translate value={`${prefix}.slowTransaction`} /></div>
                  <div><Translate value={`${prefix}.fast`} /></div>
                </div>

                <Field
                  component={Slider}
                  name='feeMultiplier'
                  {...FEE_RATE_MULTIPLIER}
                  toFixed={1}
                />
              </div>
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
