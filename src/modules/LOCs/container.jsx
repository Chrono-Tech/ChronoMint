import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import actionCreators from './actions'
import cx from 'classnames'
import numeral from 'numeral'
import {currency} from '../../components/common/formatting'

const mapState = (state) => {
  return {
    ...state.debt
  }
}

@connect(mapState, actionCreators)
export default class Accounts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditingAccount: false,
      canDeleteAccount: false,
      acc: {}
    }
  }

  updateAcc = (obj) => {
    this.closeAccEdit()
    if(obj.id){
      return this.props.updateAccount(obj)
    } else {
      return this.props.addAccount(obj)
    }
  }

  deleteAcc = (obj) => {
    this.closeAccEdit()
    if(obj.id){
      return this.props.deleteAccount(obj)
    }
    return obj;
  }

  addAcc = (acc) => {
    this.setState({isEditingAccount: true, canDeleteAccount: false, acc: acc})
  }

  editAcc = (acc) => {
    this.setState({isEditingAccount: true, canDeleteAccount: true, acc: acc})
  }

  closeAccEdit = () => {
    this.setState({isEditingAccount: false, canDeleteAccount: false, acc: {}})
  }

  render() {
    const { accounts, total } = this.props
    return (
      <div>
        <div className="title-bar _clear--both">
          <div className="_float--left">
            <h3>Bank Accounts</h3>
            <h4>Please review the customer's accounts</h4>
          </div>
          <button className="_float--right button button--secondary" onClick={ () => this.addAcc() }>Add Account</button>
        </div>
        <table className="table table-abank">
          <thead>
            <tr>
              <th title="type">Type</th>
              <th title="Account">Account</th>
              <th title="Rate" className="u-text-right">Rate</th>
              <th title="Term" className="u-text-right">Remaining Maturity</th>
              <th title="Instalments" className="u-text-right">Instalments</th>
              <th title="Total Exposure" className="u-text-right">Total Exposure</th>
              <th title="Remaining Capital" className="u-text-right">Balance</th>
              <th title="Arrears" className="u-text-right">Arrears</th>
              <th title="Charges" className="u-text-right">Charges</th>
            </tr>
          </thead>
          {accounts.map((acc,i) =>
            <tbody key={i}>
              <tr onClick={ () => this.editAcc(acc) }>
                <td><span className="droplet">{acc.type}</span></td>
                <td><span className="">{acc.name}</span></td>
                <td className="u-text-right">{acc.rate}%</td>
                <td className="u-text-right">{acc.remainingTerm} months</td>
                <td className="u-text-right"><strong>{currency(acc.instalment)}</strong></td>
                <td className="u-text-right">{currency(acc.totalExposure)}</td>
                <td className="u-text-right">{currency(acc.balance)}</td>
                <td className="u-text-right">{currency(acc.arrears)}</td>
                <td className="u-text-right">{currency(acc.charges)}</td>
              </tr>
            </tbody>
          )}
          <tfoot>
            <tr className="tr--total">
              <td colSpan="4">Total {currency(total.totalDebt)}</td>
              <td className="u-text-right">{currency(total.instalment)}</td>
              <td className="u-text-right">{currency(total.totalExposure)}</td>
              <td className="u-text-right">{currency(total.balance)}</td>
              <td className="u-text-right">{currency(total.arrears)}</td>
              <td className="u-text-right">{currency(total.charges)}</td>
            </tr>
          </tfoot>
        </table>
        <Footer forward="demographics"/>
        <Modal
          title="Account"
          isOpen={this.state.isEditingAccount}
          onRequestClose={this.closeAccEdit}
          submitText="Save"
          showDeleteButton={this.state.canDeleteAccount}
          deleteText="Delete"
          showFooterActions>
          <EditAccount account={this.state.acc} save={this.updateAcc} delete={this.deleteAcc}/>
        </Modal>
      </div>
    )
  }
}
