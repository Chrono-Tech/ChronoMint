/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button } from 'components'
import { change, Field, formValueSelector, reduxForm } from 'redux-form/immutable'
import Preloader from 'components/common/Preloader/Preloader'
import { MenuItem } from '@material-ui/core'
import PropTypes from 'prop-types'
import React from 'react'
import Immutable from 'immutable'
import SwipeableViews from 'react-swipeable-views'
import { TextField } from 'redux-form-material-ui'
import Select from 'redux-form-material-ui/es/Select'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { modalsOpen } from 'redux/modals/actions'
import { search } from '@chronobank/core/redux/exchange/actions'
import { DUCK_EXCHANGE } from '@chronobank/core/redux/exchange/constants'
import AddExchangeDialog from 'components/exchange/AddExchangeDialog/AddExchangeDialog'
import { FORM_EXCHANGE } from 'components/constants'
import validate from './validate'

import './ExchangeWidget.scss'

const MODES = [
  { index: 0, name: 'BUY', title: <Translate value={prefix('buy')} /> },
  { index: 1, name: 'SELL', title: <Translate value={prefix('sell')} /> },
]

const mapStateToProps = (state) => {
  const exchange = state.get(DUCK_EXCHANGE)
  const selector = formValueSelector(FORM_EXCHANGE)
  return {
    isFetching: exchange.isFetching(),
    isFetched: exchange.isFetched(),
    assetSymbols: exchange.assetSymbols(),
    filterMode: selector(state, 'filterMode'),
    initialValues: new Immutable.Map({ filterMode: MODES[0] }),
    showFilter: exchange.showFilter(),
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleOpenAddExchangeDialog: () => dispatch(modalsOpen({
    component: AddExchangeDialog,
  })),
})

function prefix (token) {
  return `components.exchange.ExchangeWidget.${token}`
}

const onSubmit = (values, dispatch) => {
  dispatch(search(values))
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_EXCHANGE, validate, onSubmit })
export default class ExchangeWidget extends React.Component {
  static propTypes = {
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    search: PropTypes.func,
    assetSymbols: PropTypes.arrayOf(PropTypes.string),
    handleSubmit: PropTypes.func,
    dispatch: PropTypes.func,
    handleOpenAddExchangeDialog: PropTypes.func,
    showFilter: PropTypes.bool,
    filterMode: PropTypes.shape({
      index: PropTypes.number,
      name: PropTypes.string,
      title: PropTypes.node,
    }),
  }

  handleChangeMode (value) {
    this.props.dispatch(change(FORM_EXCHANGE, 'filterMode', MODES[value]))
  }

  render () {
    return (
      <div>
        <div styleName='header'>
          <div styleName='headerTitle'><Translate value={prefix('exchange')} /></div>
          <div styleName='createExchangeWrapper'><Button
            label={<Translate value={prefix('createExchange')} />}
            onClick={this.props.handleOpenAddExchangeDialog}
          />
          </div>
          {this.props.showFilter &&
          <ul styleName='tabs'>
            {MODES.map((el, index) => (
              <li
                styleName='tab'
                key={el.name}
                className={el === this.props.filterMode ? 'active' : null}
                onClick={() => this.handleChangeMode(index)}
              >
                <span styleName='tabTitle'>
                  <i className='material-icons'>compare_arrows</i>
                  <span>{el.title}</span>
                </span>
              </li>
            ))}
          </ul>
          }
        </div>
        <div styleName='content'>
          <form onSubmit={this.props.handleSubmit}>
            <SwipeableViews
              index={this.props.filterMode ? this.props.filterMode.index : 0}
              onChangeIndex={(index) => this.handleChangeMode(index)}
            >
              {MODES.map((el) => (
                <div styleName='slide' key={el.name}>
                  <div styleName='wrapper'>
                    <div styleName='item'>
                      <Field
                        component={TextField}
                        disabled={!this.props.isFetched || this.props.isFetching || !this.props.showFilter}
                        name='amount'
                        fullWidth
                        floatingLabelText={<Translate value={prefix('amount')} />}
                      />
                    </div>
                    <div styleName='item'>
                      <Field
                        name='token'
                        disabled={!this.props.isFetched || this.props.isFetching || !this.props.showFilter}
                        component={Select}
                        fullWidth
                        floatingLabelText={<Translate value={prefix('token')} />}
                      >
                        {
                          this.props.assetSymbols.length > 0
                            ? this.props.assetSymbols
                              .map((symbol) => <MenuItem key={symbol} value={symbol} primaryText={symbol} />)
                            : <MenuItem
                              key='emptyList'
                              disabled
                              value={null}
                              primaryText={<Translate value={prefix('emptyList')} />}
                            />
                        }
                      </Field>
                    </div>
                    <div styleName='item'>
                      <div styleName='actions'>
                        <Button
                          type='submit'
                          disabled={!this.props.isFetched || this.props.isFetching || !this.props.showFilter}
                          label={
                            <span>
                              {this.props.isFetching ? <Preloader /> : <Translate value={prefix('search')} />}
                            </span>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </SwipeableViews>
          </form>
          {
            !this.props.showFilter &&
            <div styleName='noMiddleware'>
              <Translate value={prefix('middlewareDisconnected')} />
            </div>
          }
        </div>
      </div>
    )
  }
}
