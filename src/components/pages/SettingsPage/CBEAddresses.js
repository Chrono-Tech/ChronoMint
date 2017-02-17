import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Dialog, RaisedButton, FloatingActionButton, FlatButton, Paper, Divider} from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import globalStyles from '../../../styles';
import AppDAO from '../../../dao/AppDAO';
import CBEModel from '../../../models/CBEModel';
import CBENoticeModel from '../../../models/notices/CBENoticeModel';
import {
    listCBE,
    formCBE,
    removeCBEToggle,
    revokeCBE,
    watchUpdateCBE,
    watchRevokeCBE,
    hideError
} from '../../../redux/ducks/settings/cbe';
import styles from './styles';

import {notify} from '../../../redux/ducks/notifier/notifier';

const mapStateToProps = (state) => ({
    list: state.get('settingsCBE').list,
    removeCBE: state.get('settingsCBE').removeCBE,
    error: state.get('settingsCBE').error
});

const mapDispatchToProps = (dispatch) => ({
    notify: (message: string) => dispatch(notify(new CBENoticeModel(message))),

    form: (cbe: CBEModel) => dispatch(formCBE(cbe)),
    getList: () => dispatch(listCBE()),
    removeToggle: (cbe: CBEModel = null) => dispatch(removeCBEToggle(cbe)),
    revoke: (address) => dispatch(revokeCBE(address, localStorage.getItem('chronoBankAccount'))),
    watchUpdate: (cbe: CBEModel) => dispatch(watchUpdateCBE(cbe)),
    watchRevoke: (address) => dispatch(watchRevokeCBE(address)),
    hideError: () => dispatch(hideError())
});

@connect(mapStateToProps, mapDispatchToProps)
class CBEAddresses extends Component {
    componentDidMount() {
        this.props.getList();

        AppDAO.watchUpdateCBE(
            cbe => this.props.watchUpdate(cbe),
            address => this.props.watchRevoke(address),
            localStorage.getItem('chronoBankAccount')
        );
    }

    handleNotify() {
        this.props.notify('My message ' + Math.random());
    }

    render() {
        return (
            <Paper style={globalStyles.paper}>
                <h3 style={globalStyles.title}>CBE addresses</h3>
                <Divider/>

                <button onClick={this.handleNotify.bind(this)}>Notify Test</button>

                <FloatingActionButton style={styles.floatingActionButton}
                                      onTouchTap={this.props.form.bind(this, new CBEModel)}>
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
                                                  type="submit"
                                                  onTouchTap={this.props.form.bind(this, item)}/>

                                    <RaisedButton label="Remove"
                                                  disabled={localStorage.getItem('chronoBankAccount') == address}
                                                  style={styles.actionButton}
                                                  type="submit"
                                                  onTouchTap={this.props.removeToggle.bind(this, item)}/>
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
                            onTouchTap={this.props.removeToggle.bind(this, null)}
                          />,
                          <FlatButton
                            label="Remove"
                            primary={true}
                            keyboardFocused={true}
                            onTouchTap={this.props.revoke.bind(this, this.props.removeCBE.address())}
                          />,
                        ]}
                    modal={false}
                    open={this.props.removeCBE.address() != null}
                    onRequestClose={this.props.removeToggle.bind(this, null)}
                >
                    Do you really want to remove CBE "{this.props.removeCBE.name()}"
                    with address "{this.props.removeCBE.address()}"?
                </Dialog>

                <Dialog
                    actions={[
                          <FlatButton
                            label="Close"
                            primary={true}
                            onTouchTap={this.props.hideError.bind(null)}
                          />
                        ]}
                    modal={false}
                    open={this.props.error}
                    onRequestClose={this.props.hideError.bind(null)}
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