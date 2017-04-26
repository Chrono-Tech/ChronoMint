import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Dialog, Paper, Divider, FloatingActionButton, FlatButton, RaisedButton, CircularProgress} from 'material-ui'
import {Table, TableHeader, TableBody, TableHeaderColumn, TableRowColumn, TableRow} from 'material-ui/Table'
import ContentAdd from 'material-ui/svg-icons/content/add'
import AbstractOtherContractModel from '../../../models/contracts/AbstractOtherContractModel'
import DefaultContractModel from '../../../models/contracts/RewardsContractModel' // any child of AbstractOtherContractModel
import globalStyles from '../../../styles'
import withSpinner from '../../../hoc/withSpinner'
import {
  listContracts,
  formContract,
  formModifyContract,
  revokeContract,
  removeContractToggle,
  hideContractError
} from '../../../redux/settings/otherContracts'
import styles from './styles'
import ls from '../../../utils/localStorage'
import localStorageKeys from '../../../constants/localStorageKeys'

const mapStateToProps = (state) => ({
  list: state.get('settingsOtherContracts').list,
  selected: state.get('settingsOtherContracts').selected,
  error: state.get('settingsOtherContracts').error,
  isReady: state.get('settingsOtherContracts').isReady,
  isFetching: state.get('settingsOtherContracts').isFetching,
  isRemove: state.get('settingsOtherContracts').isRemove
})

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listContracts()),
  form: (contract: AbstractOtherContractModel) => dispatch(formContract(contract)),
  modifyForm: (contract: AbstractOtherContractModel) => dispatch(formModifyContract(contract)),
  handleRemoveToggle: (contract: AbstractOtherContractModel = null) => dispatch(removeContractToggle(contract)),
  remove: (contract: AbstractOtherContractModel) => dispatch(
    revokeContract(contract, ls(localStorageKeys.ACCOUNT))),
  handleHideError: () => dispatch(hideContractError())
})

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
class OtherContracts extends Component {
  componentWillMount () {
    if (!this.props.isReady && !this.props.isFetching) {
      this.props.getList()
    }
  }

  render () {
    return (
      <Paper style={globalStyles.paper}>
        <h3 style={globalStyles.title}>Other contracts</h3>
        <Divider />

        <FloatingActionButton style={styles.floatingActionButton}
          onTouchTap={this.props.form.bind(null, new DefaultContractModel())}>
          <ContentAdd />
        </FloatingActionButton>

        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.columns.name}>Name</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.address}>Smart contract address</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.action}>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.list.entrySeq().map(([index, item]) =>
              <TableRow key={index}>
                <TableRowColumn style={styles.columns.name}>{item.isUnknown() ? 'Loading...' : item.name()}</TableRowColumn>
                <TableRowColumn style={styles.columns.address}>{item.address()}</TableRowColumn>
                <TableRowColumn style={styles.columns.action}>
                  {item.isFetching()
                    ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}} />
                    : <div>
                      <RaisedButton label='Modify'
                        style={styles.actionButton}
                        onTouchTap={this.props.modifyForm.bind(null, item)} />

                      <RaisedButton label='Remove'
                        style={styles.actionButton}
                        onTouchTap={this.props.handleRemoveToggle.bind(null, item)} />
                    </div>}
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog
          title='Remove other contract'
          actions={[
            <FlatButton
              label='Cancel'
              primary
              onTouchTap={this.props.handleRemoveToggle.bind(null, null)}
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
          onRequestClose={this.props.handleRemoveToggle.bind(null, null)}
        >
          Do you really want to remove contract "{this.props.selected.name()}"
          with address "{this.props.selected.address()}"?
        </Dialog>

        <Dialog
          actions={[
            <FlatButton
              label='Close'
              primary
              onTouchTap={this.props.handleHideError}
            />
          ]}
          modal={false}
          open={!!this.props.error}
          onRequestClose={this.props.handleHideError}
        >
          Error occurred while processing your request.
          Valid contract at "{this.props.error}" not found or already added.
        </Dialog>

        <div style={globalStyles.clear} />
      </Paper>
    )
  }
}

export default OtherContracts
