import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Table, TableBody, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import PageBase from './PageBase2'
import {revoke, confirm, getPendings} from '../redux/pendings/data'
import {getConfirmations} from '../redux/completedOperations/data'
import {getProps} from '../redux/pendings/operationsProps/data'
import globalStyles from '../styles'
import withSpinner from '../hoc/withSpinner'
import {listCBE} from '../redux/settings/cbe'
import {getLOCs} from '../redux/locs/actions'
import {showChangeNumberSignaturesModal} from '../redux/ui/modal'

const handleRevoke = (operation) => {
  revoke({operation}, window.localStorage.chronoBankAccount)
}

const handleConfirm = (operation) => {
  confirm({operation}, window.localStorage.chronoBankAccount)
}

const mapStateToProps = (state) => ({
  pendings: state.get('pendings'),
  operationsProps: state.get('operationsProps'),
  completed: state.get('completedOperations'),
  locs: state.get('locs'),
  settingsCBE: state.get('settingsCBE'),
  pendingCommunication: state.get('pendingsCommunication'),
  operationsPropsCommunication: state.get('operationsPropsCommunication'),
  completedCommunication: state.get('completedCommunication'),
  locsCommunication: state.get('locsCommunication')
})

const mapDispatchToProps = (dispatch) => ({
  getPendings: (account) => dispatch(getPendings(account)),
  getProps: (account) => dispatch(getProps(account)),
  getCompleted: () => dispatch(getConfirmations()),
  getLOCs: (account) => dispatch(getLOCs(account)),
  getListCBE: () => dispatch(listCBE()),
  handleShowChangeNumberSignaturesModal: () => dispatch(showChangeNumberSignaturesModal())
})

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
class OperationsPage extends Component {
  account = window.localStorage.chronoBankAccount;

  componentWillMount () {
    if (!this.props.pendingCommunication.isReady && !this.props.pendingCommunication.isFetching) {
      this.props.getPendings(this.account)
    }
    if (!this.props.operationsPropsCommunication.isReady && !this.props.operationsPropsCommunication.isFetching) {
      this.props.getProps(this.account)
    }
    if (!this.props.completedCommunication.isReady && !this.props.completedCommunication.isFetching) {
      this.props.getCompleted(this.account)
    }
    if (!this.props.locsCommunication.isReady && !this.props.locsCommunication.isFetching) {
      this.props.getLOCs(this.account)
    }
    if (!this.props.settingsCBE.isReady && !this.props.settingsCBE.isFetching) {
      this.props.getListCBE()
    }
  }

  whoIs (item, functionName = '') {
    const address = item.targetAddress ? item.targetAddress() : item
    if (functionName === 'addKey') {
      return item.targetObjName()
    }

    const loc = this.props.locs.get(address)
    const cbe = this.props.settingsCBE.list.get(address)
    return loc ? loc.name() : cbe ? cbe.strName() : address
  }

  render () {
    const styles = {
      itemTitle: {
        fontSize: 32,
        lineHeight: '64px'
      },
      tableHeader: {
        fontWeight: 600
      },
      columns: {
        description: {
          width: '99%'
        },
        signatures: {
          width: 50
        },
        view: {
          width: 40
        },
        actions: {
          width: 40
        }
      }
    }
    const {pendings, operationsProps, completed} = this.props
    return (
      <PageBase title={<span>ChronoMint Operations</span>}>
        <div style={globalStyles.description}>
          Here you can see all of the operations that are performed through ChronoMint. Each operation must be signed
          by a number of CBE key holders before it is processed<br />
        </div>
        <FlatButton label='CHANGE NUMBER OF REQUIRED SIGNATURES'
          style={{marginTop: 16}}
          labelStyle={globalStyles.flatButtonLabel}
          onTouchTap={this.props.handleShowChangeNumberSignaturesModal}
        />
        <div style={styles.itemTitle}>Pending operations</div>
        <Paper style={{position: 'relative'}}>
          <div>
            <Table>
              <TableBody displayRowCheckbox={false}>
                <TableRow displayBorder={false}>
                  <TableHeaderColumn
                    style={{...styles.columns.description, ...styles.tableHeader}}>Description</TableHeaderColumn>
                  <TableHeaderColumn
                    style={{...styles.columns.signatures, ...styles.tableHeader}}>Signatures</TableHeaderColumn>
                  <TableHeaderColumn
                    style={{...styles.columns.view, ...styles.tableHeader}}>Actions</TableHeaderColumn>
                  <TableHeaderColumn style={styles.columns.actions}>&nbsp;</TableHeaderColumn>
                </TableRow>
                {pendings.map((item, key) => {
                  const signaturesRequired = operationsProps.signaturesRequired()
                  const signatures = signaturesRequired - item.needed()
                  const operation = item.get('operation')
                  const hasConfirmed = item.get('hasConfirmed')
                  /* const targetAddress = item.targetAddress(); */
                  const functionName = item.functionName()
                  const objName = this.whoIs(item, functionName)
                  let args = item.functionArgs()
                  args = args.map(arg => this.whoIs(arg))
                  args = args.join(', ')
                  const description = (item.type() ? item.type() + ' / ' : '') +
                    functionName + '(' + args + '): ' + objName

                  return (
                    <TableRow key={key} displayBorder={false} style={globalStyles.item.greyText}>
                      <TableRowColumn>{description}</TableRowColumn>
                      <TableRowColumn>{'' + signatures + ' of ' + signaturesRequired}</TableRowColumn>
                      <TableRowColumn>
                        <FlatButton label='VIEW'
                          style={{minWidth: 'initial'}}
                          labelStyle={globalStyles.flatButtonLabel} />
                      </TableRowColumn>
                      <TableRowColumn style={styles.columns.actions}>
                        <FlatButton label={hasConfirmed ? ('REVOKE') : ('SIGN')}
                          style={{minWidth: 'initial'}}
                          labelStyle={globalStyles.flatButtonLabel}
                          onTouchTap={() => {
                            (hasConfirmed ? handleRevoke : handleConfirm)(operation)
                          }}
                        />
                      </TableRowColumn>
                    </TableRow>
                  )
                }).toArray()}
              </TableBody>
            </Table>
          </div>
          {
            this.props.pendingCommunication.isFetching
              ? <CircularProgress style={{position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)'}} />
              : null
          }
        </Paper>
        <div style={styles.itemTitle}>Completed operations</div>
        <Paper style={{position: 'relative'}}>
          <div>
            <Table>
              <TableBody displayRowCheckbox={false}>
                <TableRow displayBorder={false}>
                  <TableHeaderColumn
                    style={{...styles.columns.description, ...styles.tableHeader}}>Operation</TableHeaderColumn>
                  <TableHeaderColumn
                    style={{...styles.columns.signatures, ...styles.tableHeader}}>Time</TableHeaderColumn>
                  <TableHeaderColumn style={styles.columns.view}>&nbsp;</TableHeaderColumn>
                  <TableHeaderColumn
                    style={{...styles.columns.actions, ...styles.tableHeader}}>Actions</TableHeaderColumn>
                </TableRow>
                {completed.map((item, key) =>
                  item.needed() ? null
                    : <TableRow key={key} displayBorder={false} style={globalStyles.item.greyText}>
                      <TableRowColumn>{item.get('operation')}</TableRowColumn>
                      <TableRowColumn colSpan='2'>{'00:00'}</TableRowColumn>
                      <TableRowColumn>
                        <FlatButton label='VIEW'
                          style={{minWidth: 'initial'}}
                          labelStyle={globalStyles.flatButtonLabel} />
                      </TableRowColumn>
                    </TableRow>
                ).toArray()}
              </TableBody>
            </Table>
          </div>
          {
            this.props.completedCommunication.isFetching
              ? <CircularProgress style={{position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)'}} />
              : null
          }
        </Paper>
      </PageBase>
    )
  }
}

export default OperationsPage
