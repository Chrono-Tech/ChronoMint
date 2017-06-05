import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import { RaisedButton, FloatingActionButton, Paper, Divider, CircularProgress } from 'material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { Translate } from 'react-redux-i18n'
import globalStyles from '../../../../styles'
import { listTokens } from '../../../../redux/settings/erc20Manager/tokens'
import styles from '../styles'

const mapStateToProps = (state) => {
  state = state.get('settingsERC2Tokens')
  return {
    list: state.list,
    isFetched: state.isFetched
  }
}

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listTokens())
})

@connect(mapStateToProps, mapDispatchToProps)
export default class Tokens extends Component {
  componentWillMount () {
    if (!this.props.isFetched) {
      this.props.getList()
    }
  }

  render () {
    return (
      <Paper style={globalStyles.paper}>
        <h3 style={globalStyles.title}><Translate value='settings.erc20.tokens'/></h3>
        <Divider />

        <FloatingActionButton style={styles.floatingActionButton}>
          <ContentAdd />
        </FloatingActionButton>

        <Table>
          <TableHeader className='xs-hide' adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.columns.name}>Name</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.address}>Address</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.action}>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody className='xs-reset-table' displayRowCheckbox={false}>
            {!this.props.isFetched
              ? <TableRow>
                <TableRowColumn>
                  <CircularProgress size={24} thickness={1.5}/>
                </TableRowColumn>
              </TableRow>
              : this.props.list.entrySeq().map(([symbol, item]) =>
                <TableRow key={symbol}>
                  <TableRowColumn style={styles.columns.name}>{item.name()}</TableRowColumn>
                  <TableRowColumn style={styles.columns.address}>{item.address()}</TableRowColumn>
                  <TableRowColumn style={styles.columns.action}>
                    {item.isFetching()
                      ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}}/>
                      : <div style={{padding: 4}}>
                        <RaisedButton label='Remove'
                                      style={styles.actionButton}/>
                      </div>}
                  </TableRowColumn>
                </TableRow>
              )
            }
          </TableBody>
        </Table>

        <div style={globalStyles.clear}/>
      </Paper>
    )
  }
}
