import React, { Component } from 'react'
import AccountList from 'components/AccountList/AccountList'

import ChronoMint from 'contracts/ChronoMint.sol';
import Web3 from 'web3';

const provider = new Web3.providers.HttpProvider('http://localhost:8545')
ChronoMint.setProvider(provider);

class AccountListContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accounts: [],
      coinbase: ''
    }

    this._getAccountBalance = this._getAccountBalance.bind(this)
    this._getAccountBalances = this._getAccountBalances.bind(this)
  }

  _getAccountBalance (account) {
var chrono = ChronoMint.deployed()
//chrono.setTimeContract(chrono.address,{from: account}).then(function() {
//        console.log(chrono.timeContract.call(account))
//});

      chrono.createLOC.call('name',{from: account}).then(function (value) {
        console.log(value.valueOf());
        //chrono.getLOC(value,{from: account})
      }).catch(function (e) {
        console.log(e)
      })
  }

  _getAccountBalances () {

    this.props.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        window.alert('There was an error fetching your accounts.')
        console.error(err)
        return
      }
      if (accs.length === 0) {
        window.alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }
 this._getAccountBalance(accs[0])
     // accs.map((account) => {
     //  this._getAccountBalance(account)
       // return this._getAccountBalance(account).then((balance) => { return { account, balance } })
     // })

      this.setState({coinbase: accs[0]})

      var accountsAndBalances = accs.map((account) => {
        return this._getAccountBalance(account).then((balance) => { return { account, balance } })
      })

      Promise.all(accountsAndBalances).then((accountsAndBalances) => {
        this.setState({accounts: accountsAndBalances, coinbaseAccount: accountsAndBalances[0]})
      })
    }.bind(this))
  }

  componentDidMount() {
    const refreshBalances = () => {
      this._getAccountBalances()
    }

    refreshBalances()
  }

  render() {
    return (
      <div>
        <AccountList accounts={this.state.accounts} />
      </div>
    )
  }
}

export default AccountListContainer
