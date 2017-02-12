import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {grey200, grey500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AppDAO from '../dao/AppDAO';
import PageBase from './PageBase';
import {listCBE, formCBE, revokeCBE, watchUpdateCBE, watchRevokeCBE} from '../redux/ducks/settings';
import CBEModel from '../models/CBEModel';

const styles = {
    floatingActionButton: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    },
    actionButton: {
        fill: grey500,
        marginRight: 20
    },
    columns: {
        name: {
            width: '25%'
        },
        address: {
            width: '45%'
        },
        action: {
            width: '30%'
        }
    }
};

const mapStateToProps = (state) => ({
    CBEs: state.get('settings').cbe.list,
});

const mapDispatchToProps = (dispatch) => ({
    formCBE: (cbe: CBEModel = new CBEModel) => dispatch(formCBE(cbe)),
    listCBE: () => dispatch(listCBE(localStorage.getItem('chronoBankAccount'))),
    revokeCBE: (address) => dispatch(revokeCBE(address, localStorage.getItem('chronoBankAccount'))),
    watchUpdateCBE: (cbe: CBEModel) => dispatch(watchUpdateCBE(cbe)),
    watchRevokeCBE: (address) => dispatch(watchRevokeCBE(address)),
});

@connect(mapStateToProps, mapDispatchToProps)
class SettingsPage extends Component {
    defaultState = {
        removeCBEOpen: false,
        removeCBEAddress: ''
    };
    state = this.defaultState;

    componentDidMount() {
        this.props.listCBE();

        AppDAO.watchUpdateCBE(cbe => this.props.watchUpdateCBE(cbe));
        AppDAO.watchRevokeCBE(address => this.props.watchRevokeCBE(address));
    }

    componentWillUnmount() {
        // TODO Unwatch contract CBEs changes
    }

    handleRemoveCBEOpen = (address) => {
        this.setState({
            ...this.defaultState,
            removeCBEOpen: true,
            removeCBEAddress: address
        });
    };

    handleRemoveCBECancel = () => {
        this.setState(this.defaultState);
    };

    handleRemoveCBEProceed = () => {
        this.props.revokeCBE(this.state.removeCBEAddress);
        this.setState(this.defaultState);
    };

    render() {
        return (
            <PageBase title="CBE addresses"
                      navigation="ChronoMint / Settings">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn style={styles.columns.name}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.address}>Address</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.action}>Action</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {this.props.CBEs.entrySeq().map(([address, item]) =>
                            <TableRow key={address}>
                                <TableRowColumn style={styles.columns.name}>{item.name()}</TableRowColumn>
                                <TableRowColumn style={styles.columns.address}>{address}</TableRowColumn>
                                <TableRowColumn style={styles.columns.action}>
                                    <RaisedButton label="Modify"
                                                  backgroundColor={grey200}
                                                  style={styles.actionButton}
                                                  type="submit"
                                                  onTouchTap={this.props.formCBE(item)}/>

                                    <RaisedButton label="Remove"
                                                  backgroundColor={grey200}
                                                  style={styles.actionButton}
                                                  type="submit"
                                                  onTouchTap={this.handleRemoveCBEOpen(address)}/>
                                </TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <FloatingActionButton style={styles.floatingActionButton}
                                      onTouchTap={this.props.formCBE()}>
                    <ContentAdd />
                </FloatingActionButton>

                <Dialog
                    title="Remove CBE address"
                    actions={[
                      <FlatButton
                        label="Cancel"
                        primary={true}
                        onTouchTap={this.handleRemoveCBECancel}
                      />,
                      <FlatButton
                        label="Remove"
                        primary={true}
                        keyboardFocused={true}
                        onTouchTap={this.handleRemoveCBEProceed}
                      />,
                    ]}
                    modal={false}
                    open={this.state.removeCBEOpen}
                    onRequestClose={this.handleRemoveCBECancel}
                >
                    Do you really want to remove CBE address "{this.state.removeCBEAddress}"
                </Dialog>
            </PageBase>
        );
    }
}

export default SettingsPage;