/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import { history } from 'redux/configureStore'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { DUCK_SIDES } from 'redux/sides/constants'
import { Button } from 'components'
import BUTTONS from './buttons'
import './TopButtons.scss'

function mapStateToProps (state) {
  return {
    stack: state.get(DUCK_SIDES).stack,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleAction: (action) => dispatch(action()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class TopButtons extends PureComponent {
  static propTypes = {
    version: PropTypes.string,
    handleAction: PropTypes.func,
    location: PropTypes.shape({
      action: PropTypes.string,
      hash: PropTypes.string,
      key: PropTypes.string,
      pathname: PropTypes.string,
      query: PropTypes.object,
      search: PropTypes.string,
      state: PropTypes.string,
    }),
  }

  handleAction = (action) => {
    return () => {
      this.props.handleAction(action)
    }
  }

  render () {
    const { location } = this.props
    const page = BUTTONS[location.pathname]
    let buttons = []
    if (page && page.buttons) {
      buttons = page.buttons
    }
    return (
      <div styleName='root'>
        <div styleName='backButtonWrapper'>
          {page && page.backButton ? (
            <Button styleName='backButton' onClick={page.backButtonAction ? this.handleAction(page.backButtonAction) : history.goBack}>
              <i styleName='backIcon' className='chronobank-icon'>back</i>
            </Button>
          ) : null}
        </div>
        {
          buttons.map((button, i) => {
            if (button.component) {
              return <button.component key={i} />
            }
            const isIconButton = !!button.chronobankIcon && !button.title
            const isButtonWithIcon = !!button.chronobankIcon && !!button.title

            return (
              <Button key={i} styleName={classnames('topButton', { 'iconButton': isIconButton, 'buttonWithIcon': isButtonWithIcon })} onClick={this.handleAction(button.action)}>
                {button.chronobankIcon && <i className='chronobank-icon'>{button.chronobankIcon}</i>}
                {button.title && <Translate value={`topButtons.${button.title}`} />}
              </Button>
            )
          })
        }
      </div>
    )
  }
}

export default TopButtons
