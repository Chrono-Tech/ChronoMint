import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import { Select, TextInput, NumInput } from '../../components/form-inputs'
import cx from 'classnames'

export default class EditAccount extends Component {

  static contextTypes = {
    modal: PropTypes.object
  }

  init = () => ({
    type: '',
    name: '',
    rate: null,
    originalTerm: null,
    remainginTerm: null,
    balance: null,
    collateral: null,
    instalment: null,
    arrears: null,
    charges: null
  })

  constructor(props) {
    super(props)
    this.state = this.init()
  }

  componentWillMount() {
    if (this.context.modal) {
      this.context.modal.registerSubmitCallback(this.submit.bind(this))
      this.context.modal.registerDeleteCallback(this.deleteAcc.bind(this))
    }
    if(this.props.account){
      this.setState(this.props.account)
    } else {
      this.setState(this.init())
    }
  }

  submit = () => {
    return this.props.save(this.state)
  }

  deleteAcc = () => {
    return this.props.delete(this.state)
  }

  render() {
    return (
      <div>
        <div className="o-grid">
          <TextInput
            label="Account Name" wide
            value={this.state.name}
            onChange={ (value) => { this.setState({ name: value}) }} />
          <NumInput
            label="Original Maturity"
            value={this.state.originalTerm}
            onChange={ (value) => { this.setState({ originalTerm: value}) }} />
          <NumInput
            label="Remaining Maturity"
            value={this.state.remainingTerm}
            onChange={ (value) => { this.setState({ remainingTerm: value}) }} />
          <NumInput
            label="Rate (%)"
            value={this.state.rate}
            onChange={ (value) => { this.setState({ rate: value}) }} />
          <NumInput
            label="Remaining Capital"
            value={this.state.balance}
            onChange={ (value) => { this.setState({ balance: value}) }} />
          <NumInput
            label="Collateral"
            value={this.state.collateral}
            onChange={ (value) => { this.setState({ collateral: value}) }} />
          <NumInput
            label="Monthly Instalment"
            value={this.state.instalment}
            onChange={ (value) => { this.setState({ instalment: value}) }} />
          <NumInput
            label="Arrears"
            value={this.state.arrears}
            onChange={ (value) => { this.setState({ arrears: value}) }} />
          <NumInput
            label="Charges"
            value={this.state.charges}
            onChange={ (value) => { this.setState({ charges: value}) }} />
        </div>
      </div>
    )
  }
}
