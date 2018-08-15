/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'

import './BackButton.scss'
import { Button } from '../../settings'

const mapStateToProps = (state) => ({
  isLoading: state.get(DUCK_NETWORK).isLoading,
})

@connect(mapStateToProps, null)
class BackButton extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    to: PropTypes.string,
    isLoading: PropTypes.bool,
  }

  render () {
    const { to, isLoading, onClick } = this.props
    return (
      <Button
        flat
        styleName='button'
        label={(
          <div styleName='root'>
            <i className='material-icons' styleName='arrow'>arrow_back</i>
            <div>{to ? <Translate value={`BackButton.backTo.${to}`} /> : <Translate value='BackButton.back' />}</div>
          </div>
        )}
        disabled={isLoading}
        onClick={onClick}
      />
    )
  }
}

export default BackButton
