import PropTypes from 'prop-types'
import React from 'react'
import { MenuItem, RaisedButton } from 'material-ui'
import { TextField, SelectField } from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form/immutable'
import SwipeableViews from 'react-swipeable-views'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'

import { ETH, LHT } from 'redux/mainWallet/actions'
import { search } from 'redux/exchange/actions'
import validate from './validate'

import './ExchangeWidget.scss'

const MODES = [
  {index: 0, name: 'BUY', title: <Translate value={prefix('buy')} />},
  {index: 1, name: 'SELL', title: <Translate value={prefix('sell')} />},
]

export const FORM_EXCHANGE = 'ExchangeForm'

const mapDispatchToProps = dispatch => ({
  search: (currency: string, isBuy: boolean) => dispatch(search(currency, isBuy)),
})

function prefix (token) {
  return `components.exchange.ExchangeWidget.${token}`
}

const onSubmit = (values, dispatch) => {
  // eslint-disable-next-line
  console.log('--ExchangeWidget#onSubmit filter', )
}

@connect(null, mapDispatchToProps)
@reduxForm({form: FORM_EXCHANGE, validate, onSubmit})
export default class ExchangeWidget extends React.Component {
  static propTypes = {
    search: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      mode: MODES[0],
      currency: LHT,
    }
  }

  componentWillMount () {
    this.handleSearch()
  }

  handleChangeMode (value) {
    this.setState({
      mode: MODES[value],
    })
  }

  handleSearch () {
    this.props.search(this.state.currency, this.state.mode.name === 'BUY')
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='header'>
          <div styleName='headerTitle'><Translate value={prefix('exchange')} /></div>
          <ul styleName='tabs'>
            {MODES.map((el, index) => (
              <li
                styleName='tab'
                key={el.name}
                className={el.name === this.state.mode.name ? 'active' : null}
                onTouchTap={() => this.handleChangeMode(index)}
              >
                <span styleName='tabTitle'>
                  <i className='material-icons'>compare_arrows</i>
                  <span>{el.title}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div styleName='content'>
          <SwipeableViews
            index={this.state.mode.index}
            onChangeIndex={index => this.handleChangeMode(index)}
          >
            {MODES.map(el => (
              <div styleName='slide' key={el.name}>
                <div className='ExchangeWidget__grid'>
                  <div className='row'>
                    <div className='col-sm-3 col-md-1'>
                      <Field
                        component={TextField}
                        name='amount'
                        fullWidth
                        floatingLabelText={<Translate value={prefix('amount')} />}
                      />
                    </div>
                    <div className='col-sm-3 col-md-1'>
                      <Field
                        name='token'
                        component={SelectField}
                        fullWidth
                        floatingLabelText={<Translate value={prefix('token')} />}
                      >
                        <MenuItem value={ETH} primaryText={ETH} />
                        <MenuItem value={LHT} primaryText={LHT} />
                      </Field>
                    </div>
                    <div className='col-sm-3 col-md-1'>
                      <div styleName='actions'>
                        <RaisedButton
                          label={<Translate value={prefix('search')} />}
                          onTouchTap={e => {
                            e.stopPropagation()
                            this.handleSearch()
                          }}
                          primary
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </SwipeableViews>
        </div>
      </div>
    )
  }
}
