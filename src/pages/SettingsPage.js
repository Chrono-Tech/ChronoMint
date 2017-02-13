import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {grey200, grey500} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AppDAO from '../dao/AppDAO';
import PageBase from './PageBase';
import {
    listCBE,
    formCBE,
    removeCBEToggle,
    revokeCBE,
    watchUpdateCBE,
    watchRevokeCBE,
    hideError
} from '../redux/ducks/settings/settings';
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
            width: '27%'
        }
    }
};

const mapStateToProps = (state) => ({
    CBEs: state.get('settings').cbe.list,
    removeCBE: state.get('settings').cbe.removeCBE,
    errorCBE: state.get('settings').cbe.error
});

const mapDispatchToProps = (dispatch) => ({
    formCBE: (cbe: CBEModel) => dispatch(formCBE(cbe)),
    listCBE: () => dispatch(listCBE(localStorage.getItem('chronoBankAccount'))),
    removeCBEToggle: (cbe: CBEModel = null) => dispatch(removeCBEToggle(cbe)),
    revokeCBE: (address) => dispatch(revokeCBE(address, localStorage.getItem('chronoBankAccount'))),
    watchUpdateCBE: (cbe: CBEModel) => dispatch(watchUpdateCBE(cbe)),
    watchRevokeCBE: (address) => dispatch(watchRevokeCBE(address)),
    hideErrorCBE: () => dispatch(hideError())
});

@connect(mapStateToProps, mapDispatchToProps)
class SettingsPage extends Component {
    componentDidMount() {
        this.props.listCBE();

        AppDAO.watchUpdateCBE(
           cbe => this.props.watchUpdateCBE(cbe),
           address => this.props.watchRevokeCBE(address),
           localStorage.getItem('chronoBankAccount')
        );
    }

    render() {
        return (
            <PageBase title="CBE addresses"
                      navigation="ChronoMint / Settings">
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={styles.columns.name}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.address}>Address</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.action}>Action</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.props.CBEs.entrySeq().map(([address, item]) =>
                            <TableRow key={address}>
                                <TableRowColumn style={styles.columns.name}>{item.name()}</TableRowColumn>
                                <TableRowColumn style={styles.columns.address}>{address}</TableRowColumn>
                                <TableRowColumn style={styles.columns.action}>
                                    <RaisedButton label="Modify"
                                                  backgroundColor={grey200}
                                                  style={styles.actionButton}
                                                  type="submit"
                                                  onTouchTap={this.props.formCBE.bind(this, item)}/>

                                    <RaisedButton label="Remove"
                                                  disabled={localStorage.getItem('chronoBankAccount') == address}
                                                  backgroundColor={grey200}
                                                  style={styles.actionButton}
                                                  type="submit"
                                                  onTouchTap={this.props.removeCBEToggle.bind(this, item)}/>
                                </TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <FloatingActionButton style={styles.floatingActionButton}
                                      onTouchTap={this.props.formCBE.bind(this, new CBEModel)}>
                    <ContentAdd />
                </FloatingActionButton>

                <Dialog
                    title="Remove CBE address"
                    actions={[
                      <FlatButton
                        label="Cancel"
                        primary={true}
                        onTouchTap={this.props.removeCBEToggle.bind(this, null)}
                      />,
                      <FlatButton
                        label="Remove"
                        primary={true}
                        keyboardFocused={true}
                        onTouchTap={this.props.revokeCBE.bind(this, this.props.removeCBE.address())}
                      />,
                    ]}
                    modal={false}
                    open={this.props.removeCBE.address() != null}
                    onRequestClose={this.props.removeCBEToggle.bind(this, null)}
                >
                    Do you really want to remove CBE "{this.props.removeCBE.name()}"
                    with address "{this.props.removeCBE.address()}"?
                </Dialog>

                <Dialog
                    actions={[
                      <FlatButton
                        label="Close"
                        primary={true}
                        onTouchTap={this.props.hideErrorCBE.bind(null)}
                      />
                    ]}
                    modal={false}
                    open={this.props.errorCBE}
                    onRequestClose={this.props.hideErrorCBE.bind(null)}
                >
                    An unknown error occurred while processing your request.
                    Maybe you made a mistake in the address field?
                </Dialog>
            </PageBase>
        );
    }
}

export default SettingsPage;