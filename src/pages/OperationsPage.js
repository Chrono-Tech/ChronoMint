import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {grey200, grey500} from 'material-ui/styles/colors';
import PageBase from './PageBase';
import RaisedButton from 'material-ui/RaisedButton';
import {connect} from 'react-redux';
import {revoke, confirm} from '../redux/ducks/pendings';

const mapStateToProps = (state) => ({
    pendings: state.get('pendings'),
});

// const mapDispatchToProps = (dispatch) => ({
//     //reject: (loc) => dispatch(reject(loc)),
// });

const handleRevoke = (conf_sign) => {
    revoke({conf_sign});
};

const handleСonfirm = (conf_sign) => {
    confirm({conf_sign});
};

let OperationsPage = (props) => {

    const styles = {
        floatingActionButton: {
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed',
        },
        editButton: {
            fill: grey500
        },
        columns: {
            id: {
                width: '5%'
            },
            name: {
                width: '40%'
            },
            price: {
                width: '20%'
            },
            category: {
                width: '20%'
            },
            edit: {
                width: '15%'
            }
        }
    };
    const {pendings} = props;
    return (
        <PageBase title="Operations List"
                  navigation="ChronoMint / Operations List">

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn style={styles.columns.id}>ID</TableHeaderColumn>
                        <TableHeaderColumn style={styles.columns.name}>name</TableHeaderColumn>
                        <TableHeaderColumn style={styles.columns.price}>type</TableHeaderColumn>
                        <TableHeaderColumn style={styles.columns.price}>needed</TableHeaderColumn>
                        <TableHeaderColumn style={styles.columns.edit}>Action</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pendings.items.map(item =>
                        <TableRow key={item.id}>
                            <TableRowColumn style={styles.columns.id}>{item.id}</TableRowColumn>
                            <TableRowColumn style={styles.columns.name}>{item.conf_sign}</TableRowColumn>
                            <TableRowColumn style={styles.columns.price}>{'' + item.type}</TableRowColumn>
                            <TableRowColumn style={styles.columns.price}>{'' + item.needed + ' of ' + pendings.props.signaturesRequired}</TableRowColumn>
                            <TableRowColumn style={styles.columns.edit}>
                                {item.hasConfirmed ? (
                                    <RaisedButton label="Reject"
                                          backgroundColor={grey200}
                                          style={styles.editButton}
                                          onTouchTap={()=>{handleRevoke(item.conf_sign);}}
                                    />
                                ):(
                                    <RaisedButton label="Approve"
                                                  style={styles.editButton}
                                                  onTouchTap={()=>{handleСonfirm(item.conf_sign);}}
                                                  primary={true}
                                    />
                                ) }
                            </TableRowColumn>
                        </TableRow>
                    )}
                </TableBody>
            </Table>,
        </PageBase>
    );
};

OperationsPage = connect(mapStateToProps )(OperationsPage);

export default OperationsPage;