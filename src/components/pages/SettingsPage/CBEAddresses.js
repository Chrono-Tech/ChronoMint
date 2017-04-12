import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import { Dialog, RaisedButton, FloatingActionButton, FlatButton, Paper, Divider, CircularProgress } from 'material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add'
import globalStyles from '../../../styles'
import withSpinner from '../../../hoc/withSpinner'
import CBEModel from '../../../models/CBEModel'
import {
  listCBE,
  formCBE,
  removeCBEToggle,
  revokeCBE
} from '../../../redux/settings/cbe'
import styles from './styles'

const mapStateToProps = (state) => ({
  list: state.get('settingsCBE').list,
  selected: state.get('settingsCBE').selected,
  isReady: state.get('settingsCBE').isReady,
  isFetching: state.get('settingsCBE').isFetching,
  isRemove: state.get('settingsCBE').isRemove
})

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listCBE()),
  form: (cbe: CBEModel) => dispatch(formCBE(cbe)),
  removeToggle: (cbe: CBEModel = null) => dispatch(removeCBEToggle(cbe)),
  revoke: (cbe: CBEModel) => dispatch(revokeCBE(cbe, window.localStorage.getItem('chronoBankAccount')))
})

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
class CBEAddresses extends Component {
  componentWillMount () {
    if (!this.props.isReady && !this.props.isFetching) {
      this.props.getList()
    }
  }

  render () {
    return (
      <Paper style={globalStyles.paper}>
        <h3 style={globalStyles.title}>CBE addresses</h3>
        <Divider />

        <FloatingActionButton style={styles.floatingActionButton}
                              onTouchTap={this.props.form.bind(null, new CBEModel())}>
          <ContentAdd />
        </FloatingActionButton>

        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.columns.name}>Name</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.address}>Address</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.action}>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.list.entrySeq().map(([address, item]) =>
              <TableRow key={address}>
                <TableRowColumn style={styles.columns.name}>{item.name()}</TableRowColumn>
                <TableRowColumn style={styles.columns.address}>{address}</TableRowColumn>
                <TableRowColumn style={styles.columns.action}>
                  {item.isFetching()
                    ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}}/>
                    : <div>
                      <RaisedButton label='Modify'
                                    style={styles.actionButton}
                                    onTouchTap={this.props.form.bind(null, item)}/>

                      <RaisedButton label='Remove'
                                    disabled={window.localStorage.getItem('chronoBankAccount') === address}
                                    style={styles.actionButton}
                                    onTouchTap={this.props.removeToggle.bind(null, item)}/>
                    </div>}
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog
          title='Remove CBE address'
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
              onTouchTap={this.props.revoke.bind(null, this.props.selected)}
            />
          ]}
          modal={false}
          open={this.props.isRemove}
          onRequestClose={this.props.removeToggle.bind(null, null)}
        >
          Do you really want to remove CBE "{this.props.selected.name()}"
          with address "{this.props.selected.address()}"?
        </Dialog>

        <div style={globalStyles.clear}/>
      </Paper>
    )
  }
}

export default CBEAddresses
