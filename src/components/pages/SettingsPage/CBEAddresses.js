import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Dialog, RaisedButton, FloatingActionButton, FlatButton, Paper, Divider} from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import globalStyles from '../../../styles';
import CBEModel from '../../../models/CBEModel';
import {
    listCBE,
    formCBE,
    removeCBEToggle,
    revokeCBE,
    hideCBEError
} from '../../../redux/ducks/settings/cbe';
import styles from './styles';

const mapStateToProps = (state) => ({
    list: state.get('settingsCBE').list,
    remove: state.get('settingsCBE').remove,
    selected: state.get('settingsCBE').selected,
    error: state.get('settingsCBE').error
});

const mapDispatchToProps = (dispatch) => ({
    form: (cbe: CBEModel) => dispatch(formCBE(cbe)),
    getList: () => dispatch(listCBE()),
    removeToggle: (cbe: CBEModel = null) => dispatch(removeCBEToggle(cbe)),
    revoke: (cbe: CBEModel) => dispatch(revokeCBE(cbe)),
    hideError: () => dispatch(hideCBEError())
});

@connect(mapStateToProps, mapDispatchToProps)
class CBEAddresses extends Component {
    componentDidMount() {
        this.props.getList();
    }

    render() {
        return (
            <Paper style={globalStyles.paper}>
                <h3 style={globalStyles.title}>CBE addresses</h3>
                <Divider/>

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
                                    <RaisedButton label="Modify"
                                                  style={styles.actionButton}
                                                  onTouchTap={this.props.form.bind(null, item)}/>

                                    <RaisedButton label="Remove"
                                                  disabled={localStorage.getItem('chronoBankAccount') === address}
                                                  style={styles.actionButton}
                                                  onTouchTap={this.props.removeToggle.bind(null, item)}/>
                                </TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Dialog
                    title="Remove CBE address"
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
                            onTouchTap={this.props.revoke.bind(null, this.props.selected)}
                          />,
                        ]}
                    modal={false}
                    open={this.props.remove}
                    onRequestClose={this.props.removeToggle.bind(null, null)}
                >
                    Do you really want to remove CBE "{this.props.selected.name()}"
                    with address "{this.props.selected.address()}"?
                </Dialog>

                <Dialog
                    actions={[
                          <FlatButton
                            label="Close"
                            primary={true}
                            onTouchTap={this.props.hideError}
                          />
                        ]}
                    modal={false}
                    open={this.props.error}
                    onRequestClose={this.props.hideError}
                >
                    An unknown error occurred while processing your request.
                    Maybe you made a mistake in the address field?
                </Dialog>

                <div style={globalStyles.clear}/>
            </Paper>
        );
    }
}

export default CBEAddresses;