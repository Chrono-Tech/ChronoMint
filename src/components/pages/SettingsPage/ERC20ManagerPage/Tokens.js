import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import { RaisedButton, FloatingActionButton, Paper, Divider, CircularProgress } from 'material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { Translate } from 'react-redux-i18n'
import globalStyles from '../../../../styles'
import TokenModel from '../../../../models/TokenModel'
import { listTokens, formToken, revokeToken } from '../../../../redux/settings/erc20Manager/tokens'
import styles from '../styles'

const mapStateToProps = (state) => {
  state = state.get('settingsERC20Tokens')
  return {
    list: state.list,
    isFetched: state.isFetched
  }
}

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listTokens()),
  form: (token: TokenModel) => dispatch(formToken(token)),
  remove: (token: TokenModel) => dispatch(revokeToken(token))
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
        <h3 style={globalStyles.title}><Translate value='settings.erc20.tokens.title'/></h3>
        <Divider />

        <FloatingActionButton style={styles.floatingActionButton}
                              onTouchTap={this.props.form.bind(null, new TokenModel())}>
          <ContentAdd />
        </FloatingActionButton>

        <Table>
          <TableHeader className='xs-hide' adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.columns.name}><Translate value='common.name'/></TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.address}><Translate value='common.address'/></TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.action}><Translate value='nav.actions'/></TableHeaderColumn>
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
                  <TableRowColumn style={styles.columns.name}>{item.symbol()}</TableRowColumn>
                  <TableRowColumn style={styles.columns.address}>{item.address()}</TableRowColumn>
                  <TableRowColumn style={styles.columns.action}>
                    {item.isFetching()
                      ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}}/>
                      : <div style={{padding: 4}}>
                        <RaisedButton label={<Translate value='terms.modify'/>}
                                      onTouchTap={this.props.form.bind(null, item)}
                                      style={styles.actionButton}/>

                        <RaisedButton label={<Translate value='terms.remove'/>}
                                      onTouchTap={this.props.remove.bind(null, item)}
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
