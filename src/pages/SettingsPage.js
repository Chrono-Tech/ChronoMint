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
import {showCBEAddressModal} from 'redux/ducks/modal';
import {listCBE, updateCBE, revokeCBE} from 'redux/ducks/settings';

// TODO Modify key
// TODO Revoke key

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
    showCBEAddressModal: () => dispatch(showCBEAddressModal()),
    listCBE: () => dispatch(listCBE(localStorage.getItem('chronoBankAccount'))),
    updateCBE: (cbe: CBEModel) => dispatch(updateCBE(cbe)),
    revokeCBE: (address) => dispatch(revokeCBE(address)),
});

@connect(mapStateToProps, mapDispatchToProps)
class SettingsPage extends Component {
    handleShowCBEAddressModal = () => {
        this.props.showCBEAddressModal();
    };

    componentDidMount() {
        this.props.listCBE();

        // TODO Uncomment strings below when contract events will be ready
        //AppDAO.watchUpdateCBE(cbe => this.props.updateCBE(cbe));
        //AppDAO.watchRevokeCBE(address => this.props.revokeCBE(address));
    }

    componentWillUnmount() {
        // TODO Unwatch contract CBEs changes
    }

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
                                    <Link className="button" to="/member_tmp_modify_route">
                                        <RaisedButton label="Modify"
                                                      backgroundColor={grey200}
                                                      style={styles.actionButton}
                                                      type="submit"/>
                                    </Link>
                                    <Link className="button" to="/member_tmp_delete_route">
                                        <RaisedButton label="Remove"
                                                      backgroundColor={grey200}
                                                      style={styles.actionButton}
                                                      type="submit"/>
                                    </Link>
                                </TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <FloatingActionButton style={styles.floatingActionButton}
                                      onTouchTap={this.handleShowCBEAddressModal.bind(null, null)}>
                    <ContentAdd />
                </FloatingActionButton>
            </PageBase>
        );
    }
}

export default SettingsPage;