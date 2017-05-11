import React, { Component } from 'react'
import { connect } from 'react-redux'
import globalStyles from '../styles'
import { Translate } from 'react-redux-i18n'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import { RaisedButton, Paper, Divider, CircularProgress } from 'material-ui'
import { grey500 } from 'material-ui/styles/colors'
import withSpinner from '../hoc/withSpinner'
import { listOperations, confirmOperation, revokeOperation } from '../redux/operations/actions'
import OperationModel from '../models/OperationModel'

const styles = {
  actionButton: {
    fill: grey500,
    marginRight: 20
  },
  pending: {
    desc: {
      width: '60%'
    },
    signs: {
      width: '25%',
      textAlign: 'center'
    },
    actions: {
      width: '190px'
    }
  },
  completed: {
    desc: {
      width: '80%'
    },
    actions: {
      width: '20%'
    }
  }
}

const mapStateToProps = (state) => ({
  list: state.get('operations').list,
  isReady: state.get('operations').isReady,
  isFetching: state.get('operations').isFetching && !state.get('operations').isReady,
  completedFetching: state.get('operations').isFetching,
  required: state.get('operations').required
})

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listOperations()),
  confirm: (operation: OperationModel) => dispatch(confirmOperation(operation)),
  revoke: (operation: OperationModel) => dispatch(revokeOperation(operation))
})

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
class OperationsPage extends Component {
  componentWillMount () {
    if (!this.props.isReady && !this.props.isFetching) {
      this.props.getList()
    }
  }

  handleViewClick = () => {
    // TODO
  }

  render () {
    return (
      <div>
        <span style={globalStyles.navigation}>
          <Translate value='nav.project' /> / <Translate value='nav.operations' />
        </span>

        <Paper style={globalStyles.paper}>
          <h3 style={globalStyles.title}><Translate value='operations.pending' /></h3>
          <Divider />
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={styles.pending.desc}>
                  <Translate value='operations.desc' />
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.pending.signs}>
                  <Translate value='operations.signs' />
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.pending.actions}>
                  <Translate value='nav.actions' />
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.props.list.valueSeq().filter(o => !o.isDone()).map(item =>
                <TableRow key={item.id()}>
                  <TableRowColumn style={styles.pending.desc}>{item.tx().description()}</TableRowColumn>
                  <TableRowColumn style={styles.pending.signs}>{item.remained()}</TableRowColumn>
                  <TableRowColumn style={styles.pending.actions}>
                    {item.isFetching()
                      ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}} />
                      : <div>
                        <RaisedButton label={<Translate value='nav.view' />}
                          style={styles.actionButton}
                          onTouchTap={this.handleViewClick} />
                        {item.isConfirmed()
                          ? <RaisedButton label={<Translate value='operations.revoke' />}
                            style={styles.actionButton}
                            onTouchTap={this.props.revoke.bind(null, item)} />
                          : <RaisedButton label={<Translate value='operations.sign' />}
                            primary
                            style={styles.actionButton}
                            onTouchTap={this.props.confirm.bind(null, item)} />}
                      </div>}
                  </TableRowColumn>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
        <div style={globalStyles.paperSpace} />

        <Paper style={globalStyles.paper}>
          <h3 style={globalStyles.title}><Translate value='operations.completed' /></h3>
          <Divider />
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={styles.completed.desc}>
                  <Translate value='operations.desc' />
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.completed.actions}>
                  <Translate value='nav.actions' />
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.props.list.valueSeq().filter(o => o.isDone()).map(item =>
                <TableRow key={item.id()}>
                  <TableRowColumn style={styles.completed.desc}>{item.tx().description()}</TableRowColumn>
                  <TableRowColumn style={styles.completed.actions}>
                    <RaisedButton label={<Translate value='nav.view' />}
                      style={styles.actionButton}
                      onTouchTap={this.handleViewClick} />
                  </TableRowColumn>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

export default OperationsPage
