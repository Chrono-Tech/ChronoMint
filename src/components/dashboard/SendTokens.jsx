import React from 'react'
import PropTypes from 'prop-types'

import { DropDownMenu, MenuItem, TextField, RaisedButton } from 'material-ui'

import IconSection from './IconSection'
import ColoredSection from './ColoredSection'

import './SendTokens.scss'

class SendTokens extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ColoredSection styleName="root"
        head={this.renderHead()}
        body={this.renderBody()}
        foot={this.renderFoot()}
      />
    )
  }

  renderHead() {
    return (
      <div>
        <IconSection title={this.props.title}>
          <div styleName="form">
            <DropDownMenu styleName="dropdown" style={{ width: 200 }}>
              <MenuItem value={1} primaryText="USD" />
              <MenuItem value={2} primaryText="EUR" />
              <MenuItem value={3} primaryText="ETH" />
            </DropDownMenu>
          </div>
        </IconSection>
        <div styleName="balance">
          <div styleName="label">Balance:</div>
          <div styleName="value">
            <span styleName="value1">1 512 000</span>
            <span styleName="value2">.00123 ETH</span>
          </div>
        </div>
      </div>
    )
  }

  renderBody() {
    return (
      <div styleName="form">
        <TextField
          floatingLabelText="Recepient address"
        />
        <TextField
          floatingLabelText="Amount"
        />
      </div>
    )
  }

  renderFoot() {
    return (
      <div styleName="table">
        <div styleName="info">
          <div styleName="fee">
            <span styleName="label">Fee:</span>
            <span styleName="value">
              <span styleName="value1">10</span>
              <span styleName="value2">.01 LHT</span>
            </span>
            <span styleName="percentage">1.00%</span>
          </div>
          <div styleName="total">
            <span styleName="label">Total:</span>
            <span styleName="value">
              <span styleName="value1">1 512 000</span>
              <span styleName="value2">.00124 ETH</span>
            </span>
          </div>
        </div>
        <div styleName="actions">
          <RaisedButton label="Send" primary />
        </div>
      </div>
    )
  }
}

SendTokens.propTypes = {
  title: PropTypes.string
}

export default SendTokens
