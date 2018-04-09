/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { FlatButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import styles from '../../components/stylesLoginPage'

import './BackButton.scss'

const mapStateToProps = (state) => ({
  isLoading: state.get('network').isLoading,
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
      <FlatButton
        secondary
        label={(
          <div styleName='root'>
            <div className='material-icons' styleName='arrow'>arrow_back</div>
            <div>{to ? <Translate value={`BackButton.backTo.${to}`} /> : <Translate value='BackButton.back' />}</div>
          </div>
        )}
        disabled={isLoading}
        onTouchTap={onClick}
        {...styles.flatButton}
      />
    )
  }
}

export default BackButton
