/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { modalsOpen } from 'redux/modals/actions'
import { revokeToken } from '@chronobank/core/redux/settings/erc20/tokens/actions'
import { getChronobankTokens } from '@chronobank/core/redux/settings/erc20/tokens/selectors'
import Preloader from 'components/common/Preloader/Preloader'
import './Tokens.scss'

function prefix (token) {
  return `components.settings.Tokens.${token}`
}

function mapStateToProps (state) {
  return {
    tokens: getChronobankTokens()(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    remove: (token) => dispatch(revokeToken(token)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Tokens extends PureComponent {
  static propTypes = {
    tokens: PropTypes.arrayOf(
      PropTypes.instanceOf(TokenModel),
    ),
    form: PropTypes.func,
    remove: PropTypes.func,
  }

  handleEdit = (token, isModify = false) => () => {
    const newToken = token || new TokenModel({
      isERC20: true,
    })
    this.props.form(newToken, isModify)
  }

  handleRemove = (token) => () => {
    this.props.remove(token)
  }

  render () {
    const { tokens } = this.props

    return (
      <div styleName='panel'>
        <div styleName='panelHead'>
          <h3 styleName='headTitle'><Translate value={prefix('tokens')} /></h3>
          <div styleName='headActions'>
            <Button
              flat
              label={<Translate value={prefix('addToken')} />}
              onClick={this.handleEdit()}
            />
          </div>
        </div>
        <div styleName='panelTable'>
          <div styleName='tableHead'>
            <div styleName='tableRow'>
              <div styleName='headTableCell'><Translate value={prefix('name')} /></div>
              <div styleName='headTableCell'><Translate value={prefix('smartContractAddress')} /></div>
              <div styleName='headTableCell'><Translate value={prefix('actions')} /></div>
            </div>
          </div>
          <div styleName='tableBody'>
            {tokens.map((token: TokenModel) => (
              <div key={token.id()} styleName='tableRow'>
                <div styleName='bodyTableCell tableCellName'>
                  <div styleName='cellTitle'>Name:&nbsp;</div>
                  <div styleName='cellName'>
                    <div styleName='nameIcon'>
                      <IPFSImage
                        styleName='iconContent'
                        multihash={token.icon()}
                      />
                    </div>
                    <div styleName='nameTitle'>
                      {token.symbol()}
                    </div>
                  </div>
                </div>
                <div styleName='bodyTableCell tableCellAddress'>
                  <div styleName='ellipsis'>
                    <div styleName='ellipsisInner'>
                      <div styleName='cellTitle'>Address:&nbsp;</div>
                      {token.address()}
                    </div>
                  </div>
                </div>
                <div styleName='bodyTableCell'>
                  {
                    token.isFetching()
                      ? <div styleName='tableCellActions'><Preloader /></div>
                      : (
                        <div styleName='tableCellActions'>
                          <div styleName='actionsItem'>
                            <Button
                              label={<Translate value='terms.modify' />}
                              onClick={this.handleEdit(token, true)}
                            />
                          </div>
                          <div styleName='actionsItem'>
                            <Button
                              label={<Translate value='terms.remove' />}
                              onClick={this.handleRemove(token)}
                            />
                          </div>
                        </div>
                      )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
