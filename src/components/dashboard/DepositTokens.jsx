import React from 'react'
import PropTypes from 'prop-types'

import IconSection from './IconSection'
import ColoredSection from './ColoredSection'

import './DepositTokens.scss'

class DepositTokens extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ColoredSection styleName="root"
        head={this.renderHead()}
        headStyle={this.props.headStyle}
      />
    )
  }

  renderHead() {
    return (
      <div>
        <IconSection title={this.props.title}>
          <div styleName="balance">
            <div styleName="label">Your time deposit:</div>
            <div styleName="value">
              <span styleName="value1">1 512 000</span>
              <span styleName="value2">.00123 TIME</span>
            </div>
          </div>
          <div styleName="balance">
            <div styleName="label">Total time deposit:</div>
            <div styleName="value">
              <span styleName="value1">1 512 000</span>
              <span styleName="value2">.00123 TIME</span>
            </div>
          </div>
        </IconSection>
      </div>
    )
  }
}

DepositTokens.propTypes = {
  title: PropTypes.string,
  headStyle: PropTypes.object
}

export default DepositTokens
