import React, { Component } from 'react'
import { connect } from 'react-redux'
import globalStyles from '../styles'
import { Translate } from 'react-redux-i18n'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import { RaisedButton, FloatingActionButton, FontIcon, Paper, Divider, CircularProgress } from 'material-ui'
import { grey500 } from 'material-ui/styles/colors'
import withSpinner from '../hoc/withSpinner'
import { listOperations, confirmOperation, revokeOperation, openOperationsSettings } from '../redux/operations/actions'
import OperationModel from '../models/OperationModel'

const styles = {
  actionButton: {
    fill: grey500,
    marginRight: 20
  },
  floatingActionButton: {
    marginTop: '-45px',
    right: '45px',
    position: 'absolute'
  },
  pending: {
    desc: {
      width: '55%'
    },
    signs: {
      width: '25%',
      textAlign: 'center'
    },
    actions: {}
  },
  completed: {
    desc: {
      width: '74%'
    },
    actions: {
      width: '26%'
    }
  }
}

const mapStateToProps = (state) => ({
  list: state.get('operations').list,
  isFetched: state.get('operations').isFetched,
  isFetching: state.get('operations').isFetching && !state.get('operations').isFetched,
  completedFetching: state.get('operations').isFetching,
  required: state.get('operations').required
})

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listOperations()),
  confirm: (operation: OperationModel) => dispatch(confirmOperation(operation)),
  revoke: (operation: OperationModel) => dispatch(revokeOperation(operation)),
  openSettings: () => dispatch(openOperationsSettings())
})

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
class OperationsPage extends Component {
  componentWillMount () {
    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getList()
    }
  }

  handleViewClick = () => {
    // TODO
  }

  render () {
    const list = this.props.list.valueSeq().sortBy(o => o.tx().time()).reverse()
    return (
      <div>
        <span style={globalStyles.navigation}>
          <Translate value='nav.project' /> / <Translate value='nav.operations' />
        </span>

        <Paper style={globalStyles.paper}>
          <h3 style={globalStyles.title}><Translate value='operations.pending' /></h3>
          <Divider />

          <FloatingActionButton style={styles.floatingActionButton} onTouchTap={this.props.openSettings.bind(null)}>
            <FontIcon className='material-icons'>settings</FontIcon>
          </FloatingActionButton>

          {this.props.list.filter(o => !o.isDone()).size > 0 ? <Table>
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
              {list.filter(o => !o.isDone()).map(item =>
                <TableRow key={item.id()}>
                  <TableRowColumn style={styles.pending.desc}>{item.tx().description()}</TableRowColumn>
                  <TableRowColumn style={styles.pending.signs}>{item.remained()}</TableRowColumn>
                  <TableRowColumn style={styles.pending.actions}>
                    {item.isFetching()
                      ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}} />
                      : <div>
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
          </Table> : <p><Translate value='operations.emptyPendingList' /></p>}
        </Paper>
        <div style={globalStyles.paperSpace} />

        <Paper style={globalStyles.paper}>
          <h3 style={globalStyles.title}><Translate value='operations.completed' /></h3>
          <Divider />
          <Table>
            <TableHeader className='xs-hide' adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={styles.completed.desc}>
                  <Translate value='operations.desc' />
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.completed.actions}>
                  <Translate value='nav.actions' />
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody className='xs-reset-table' displayRowCheckbox={false}>
              {list.filter(o => o.isDone()).map(item =>
                <TableRow key={item.id()}>
                  <TableRowColumn style={styles.completed.desc}>{item.tx().description()}</TableRowColumn>
                  <TableRowColumn style={styles.completed.actions}>
                    <RaisedButton label={<Translate value='nav.view' />}
                      style={styles.actionButton} disabled
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
