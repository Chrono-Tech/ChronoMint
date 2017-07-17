import React from 'react'
import PropTypes from 'prop-types'

import './ProgressSection.scss'

class ProgressSection extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='before' style={{ width: this.props.value + '%' }}></div>
        <div styleName='current'>
          <div styleName='dot'>{this.props.value}%</div>
        </div>
        <div styleName='after' style={{ width: (100 - this.props.value) + '%' }}></div>
      </div>
    )
  }
}

ProgressSection.propTypes = {
  value: PropTypes.number
}


export default ProgressSection
