/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_SIDES } from 'redux/sides/actions'
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
    const page = BUTTONS[ location.pathname ]
    let buttons = []
    if (page) {
      buttons = page.buttons
    }
    return (
      <div styleName='root'>
        {
          buttons.map((button) => (
            <Button key={button.title} styleName='topButton' onTouchTap={this.handleAction(button.action)}>
              <Translate value={`topButtons.${button.title}`} />
            </Button>
          ))
        }
      </div>
    )
  }
}

export default TopButtons
