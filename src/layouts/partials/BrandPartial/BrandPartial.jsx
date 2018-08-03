/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { IconButton } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { openBrandPartial } from 'redux/ui/actions'
import Rates from 'components/common/Rates/index'
import styles from '../styles'

import './BrandPartial.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class BrandPartial extends PureComponent {
  static propTypes = {
    handleChangeLocale: PropTypes.func,
    toggleBrandPartial: PropTypes.func,
    open: PropTypes.bool,
  }

  handleToggle () {
    this.props.toggleBrandPartial(!this.props.open)
  }

  render () {
    const { open } = this.props

    return (
      <div styleName='root' className='BrandPartial__root'>
        {open
          ? (
            <div styleName='row when-open'>
              <Rates />
            </div>
          )
          : null
        }
        <div styleName='toggle'>
          <IconButton
            style={{
              padding: 0,
              width: 30,
              height: 30,
            }}
            iconStyle={styles.brand.toggle.iconStyle}
            onClick={() => this.handleToggle()}
          >
            <i className='material-icons'>{open ? 'arrow_upward' : 'arrow_downward'}</i>
          </IconButton>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    open: state.get('ui').open,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toggleBrandPartial: (open) => dispatch(openBrandPartial(open)),
  }
}

