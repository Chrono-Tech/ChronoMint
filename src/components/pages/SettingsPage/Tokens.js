import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dialog, Paper, Divider, FlatButton, FloatingActionButton, RaisedButton, CircularProgress } from 'material-ui'
import { Table, TableHeader, TableBody, TableHeaderColumn, TableRowColumn, TableRow } from 'material-ui/Table'
import ContentAdd from 'material-ui/svg-icons/content/add'
import globalStyles from '../../../styles'
import withSpinner from '../../../hoc/withSpinner'
import {
  listTokens,
  viewToken,
  formToken,
  revokeToken,
  removeTokenToggle,
  hideTokenError
} from '../../../redux/settings/tokens'
import TokenContractModel from '../../../models/contracts/TokenContractModel'
import styles from './styles'
import ls from '../../../utils/localStorage'
import localStorageKeys from '../../../constants/localStorageKeys'

const customStyles = {
  columns: {
    name: {
      width: '15%'
    },
    address: {
      width: '55%'
    },
    action: {
      width: '295px'
    }
  }
}

const mapStateToProps = (state) => ({
  list: state.get('settingsTokens').list,
  error: state.get('settingsTokens').error,
  selected: state.get('settingsTokens').selected,
  isReady: state.get('settingsTokens').isReady,
  isFetching: state.get('settingsTokens').isFetching,
  isRemove: state.get('settingsTokens').isRemove
})

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listTokens()),
  view: (token: TokenContractModel) => dispatch(viewToken(token)),
  form: (token: TokenContractModel) => dispatch(formToken(token)),
  removeToggle: (token: TokenContractModel = null) => dispatch(removeTokenToggle(token)),
  remove: (token: TokenContractModel) => dispatch(revokeToken(token, ls(localStorageKeys.ACCOUNT))),
  hideError: () => dispatch(hideTokenError())
})

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
class Tokens extends Component {
  componentWillMount () {
    if (!this.props.isReady && !this.props.isFetching) {
      this.props.getList()
    }
  }

  render () {
    return (
      <Paper style={globalStyles.paper}>
        <h3 style={globalStyles.title}>Tokens</h3>
        <Divider />

        <FloatingActionButton style={styles.floatingActionButton}
          onTouchTap={this.props.form.bind(this, new TokenContractModel())}>
          <ContentAdd />
        </FloatingActionButton>

        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={customStyles.columns.name}>Name</TableHeaderColumn>
              <TableHeaderColumn style={customStyles.columns.address}>Smart contract address</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.action}>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.list.entrySeq().map(([index, item]) =>
              <TableRow key={index}>
                <TableRowColumn style={customStyles.columns.name}>
                  {item.isFetching() ? 'Loading...' : item.symbol()}
                </TableRowColumn>
                <TableRowColumn style={customStyles.columns.address}>
                  {!item.proxyAddress() ? <p>{item.address()}</p> : <div>
                    <p>Asset: {item.address()}</p>
                    <p>Proxy: {item.proxyAddress()}</p>
                  </div>}
                </TableRowColumn>
                <TableRowColumn style={customStyles.columns.action}>
                  {item.isFetching()
                    ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}} />
                    : <div>
                      <RaisedButton label='View'
                        style={styles.actionButton}
                        onTouchTap={this.props.view.bind(this, item)} />

                      <RaisedButton label='Modify'
                        style={styles.actionButton}
                        onTouchTap={this.props.form.bind(this, item)} />

                      <RaisedButton label='Remove'
                        style={styles.actionButton}
                        onTouchTap={this.props.removeToggle.bind(this, item)} />
                    </div>}
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog
          title='Remove token'
          actions={[
            <FlatButton
              label='Cancel'
              primary
              onTouchTap={this.props.removeToggle.bind(null, null)}
            />,
            <FlatButton
              label='Remove'
              primary
              keyboardFocused
              onTouchTap={this.props.remove.bind(null, this.props.selected)}
            />
          ]}
          modal={false}
          open={this.props.isRemove}
          onRequestClose={this.props.removeToggle.bind(null, null)}
        >
          Do you really want to remove token
          "{this.props.selected.symbol()} &ndash; {this.props.selected.name()}"
          with asset address "{this.props.selected.address()}"
          and proxy address "{this.props.selected.proxyAddress()}"?
        </Dialog>

        <Dialog
          actions={[
            <FlatButton
              label='Close'
              primary
              onTouchTap={this.props.hideError.bind(null)}
            />
          ]}
          modal={false}
          open={!!this.props.error}
          onRequestClose={this.props.hideError.bind(null)}
        >
          Error occurred while processing your request.
          Asset or proxy contract at "{this.props.error}" not found or already added.
        </Dialog>

        <div style={globalStyles.clear} />
      </Paper>
    )
  }
}

export default Tokens
