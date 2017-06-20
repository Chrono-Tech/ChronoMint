import React, { Component } from 'react'
import { Paper } from 'material-ui'
import { ExchangeWidget, OrdersTable } from 'components'

import styles from 'layouts/partials/styles'
import './ExchangeContent.scss'

export default class ExchangeContent extends Component {

  render() {
    return (
      <div styleName="root">
        <div styleName="content">
          <div styleName="inner">
            <div className="ExchangeContent__grid">
              <div className="row">
                <div className="col-xs-6">
                  <div styleName="exchangBox">
                    <Paper style={styles.content.paper.style}>
                      <ExchangeWidget />
                    </Paper>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <Paper style={styles.content.paper.style}>
                    <OrdersTable />
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
