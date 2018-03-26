import { FontIcon, IconButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { OPEN_BRAND_PARTIAL } from 'redux/ui/reducer'
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
            onTouchTap={() => this.handleToggle()}
          >
            <FontIcon className='material-icons'>{open ? 'arrow_upward' : 'arrow_downward'}</FontIcon>
          </IconButton>
        </div>
      </div>
    )
  }

  handleToggle () {
    this.props.toggleBrandPartial(!this.props.open)
  }
}

function mapStateToProps (state) {
  return {
    open: state.get('ui').open,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toggleBrandPartial: (open) => dispatch({ type: OPEN_BRAND_PARTIAL, payload: { open } }),
  }
}

