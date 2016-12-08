
import React, { Component } from 'react'

class LOC extends Component {
  render() {
    return (
      <table>
        <thead>
          <tr><td>Account</td><td>META</td></tr>
        </thead>
        <tbody>
          {this.props.accounts.map(this.renderAccount)}
        </tbody>
      </table>
    )
  }

}

export default LOC
