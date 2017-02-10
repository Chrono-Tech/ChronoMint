import React, {Component} from 'react';
import {connect} from 'react-redux';
import {showCBEAddressModal} from 'redux/ducks/modal';
import {Link} from 'react-router';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {grey200, grey500} from 'material-ui/styles/colors';
import PageBase from './PageBase';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Data from '../data';

// TODO List of keys
// TODO Revoke key
// TODO Address name

const styles = {
    floatingActionButton: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    },
    deleteButton: {
        fill: grey500
    },
    columns: {
        id: {
            width: '5%'
        },
        address: {
            width: '75%'
        },
        edit: {
            width: '15%'
        }
    }
};

const mapStateToProps = (state) => ({
    // TODO
});

const mapDispatchToProps = (dispatch) => ({
    showCBEAddressModal: () => dispatch(showCBEAddressModal()),
});

@connect(mapStateToProps, mapDispatchToProps)
class CBEAddressesPage extends Component {
    handleShowCBEAddressModal = () => {
        this.props.showCBEAddressModal();
    };

    render() {
        return (
            <PageBase title="CBE addresses"
                      navigation="ChronoMint / CBE addresses">

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn style={styles.columns.id}>ID</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.address}>Address</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.edit}>Action</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Data.tablePage.items.map(item =>
                            <TableRow key={item.id}>
                                <TableRowColumn style={styles.columns.id}>{item.id}</TableRowColumn>
                                <TableRowColumn style={styles.columns.address}>{item.name}</TableRowColumn>
                                <TableRowColumn style={styles.columns.edit}>
                                    <Link className="button" to="/member_tmp_delete_route">
                                        <RaisedButton label="Delete"
                                                      backgroundColor={grey200}
                                                      style={styles.deleteButton}
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

export default CBEAddressesPage;