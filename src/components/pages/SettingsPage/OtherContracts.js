import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dialog, Paper, Divider, FloatingActionButton, FlatButton, RaisedButton} from 'material-ui';
import {Table, TableHeader, TableBody, TableHeaderColumn, TableRowColumn, TableRow} from 'material-ui/Table';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AbstractOtherContractModel from '../../../models/contracts/AbstractOtherContractModel';
import DefaultContractModel from '../../../models/contracts/RewardsContractModel'; // any child of AbstractOtherContractModel
import globalStyles from '../../../styles';
import withSpinner from '../../../hoc/withSpinner';
import {
    listContracts,
    formContract,
    formModifyContract,
    removeContract,
    removeContractToggle,
    hideContractError
} from '../../../redux/ducks/settings/otherContracts';
import styles from './styles';

const mapStateToProps = (state) => ({
    list: state.get('settingsOtherContracts').list,
    ready: state.get('settingsOtherContracts').ready,
    removeState: state.get('settingsOtherContracts').remove,
    selected: state.get('settingsOtherContracts').selected,
    error: state.get('settingsOtherContracts').error,
    isFetching: state.get('settingsOtherContracts').isFetching
});

const mapDispatchToProps = (dispatch) => ({
    getList: () => dispatch(listContracts()),
    form: (contract: AbstractOtherContractModel) => dispatch(formContract(contract)),
    modifyForm: (contract: AbstractOtherContractModel) => dispatch(formModifyContract(contract)),
    removeToggle: (contract: AbstractOtherContractModel = null) => dispatch(removeContractToggle(contract)),
    remove: (contract: AbstractOtherContractModel) => dispatch(
        removeContract(contract, localStorage.getItem('chronoBankAccount'))),
    handleHideError: () => dispatch(hideContractError())
});

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
class OtherContracts extends Component {
    componentDidMount() {
        if (!this.props.ready) {
            this.props.getList();
        }
    }

    render() {
        return (
            <Paper style={globalStyles.paper}>
                <h3 style={globalStyles.title}>Other contracts</h3>
                <Divider/>

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
                                <TableRowColumn style={styles.columns.name}>{item.name()}</TableRowColumn>
                                <TableRowColumn style={styles.columns.address}>{item.address()}</TableRowColumn>
                                <TableRowColumn style={styles.columns.action}>
                                    <RaisedButton label="Modify"
                                                  style={styles.actionButton}
                                                  onTouchTap={this.props.modifyForm.bind(null, item)}/>

                                    <RaisedButton label="Remove"
                                                  style={styles.actionButton}
                                                  onTouchTap={this.props.removeToggle.bind(null, item)}/>
                                </TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Dialog
                    title="Remove other contract"
                    actions={[
                          <FlatButton
                            label="Cancel"
                            primary={true}
                            onTouchTap={this.props.removeToggle.bind(null, null)}
                          />,
                          <FlatButton
                            label="Remove"
                            primary={true}
                            keyboardFocused={true}
                            onTouchTap={this.props.remove.bind(null, this.props.selected)}
                          />,
                        ]}
                    modal={false}
                    open={this.props.removeState}
                    onRequestClose={this.props.removeToggle.bind(null, null)}
                >
                    Do you really want to remove contract "{this.props.selected.name()}"
                    with address "{this.props.selected.address()}"?
                </Dialog>

                <Dialog
                    actions={[
                          <FlatButton
                            label="Close"
                            primary={true}
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

                <div style={globalStyles.clear}/>
            </Paper>
        );
    }
}

export default OtherContracts;