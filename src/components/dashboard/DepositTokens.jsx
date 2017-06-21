import React from 'react'
import PropTypes from 'prop-types'

import { TextField, RaisedButton, FlatButton } from 'material-ui'

import IconSection from './IconSection'
import ColoredSection from './ColoredSection'

import './DepositTokens.scss'

class DepositTokens extends React.Component {

  static propTypes = {
    title: PropTypes.string
  }

  render() {
    return (
      <ColoredSection styleName="root"
        head={this.renderHead()}
        body={this.renderBody()}
        foot={this.renderFoot()} />
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

  renderBody() {
    return (
      <div styleName="form">
        <div>
          <TextField
            floatingLabelText="Amount"
            style={{width: '150px'}}
          />
        </div>
      </div>
    )
  }

  renderFoot() {
    return (
      <div styleName="actions">
        <span styleName="action">
          <FlatButton label="Require time" />
        </span>
        <span styleName="action">
          <RaisedButton label="Lock" />
        </span>
        <span styleName="action">
          <RaisedButton label="Withdraw" primary />
        </span>
      </div>
    )
  }
}

export default DepositTokens
