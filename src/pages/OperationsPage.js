import React from 'react';
import {Table, TableBody, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import PageBase from './PageBase2';
import {connect} from 'react-redux';
import {revoke, confirm} from '../redux/ducks/pendings/pendings';
import globalStyles from '../styles';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

const mapStateToProps = (state) => ({
    pendings: state.get('pendings'),
});

const handleRevoke = (conf_sign) => {
    revoke({conf_sign});
};

const handleConfirm = (conf_sign) => {
    confirm({conf_sign});
};

let OperationsPage = (props) => {

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
            },
        }
    };
    const {pendings} = props;
    return (
        <PageBase title={<span>ChronoMint Operations</span>}>
            <div style={globalStyles.description}>
                Here you can see all of the operations that are performed through ChronoMint. Each operation must be signed
                by a number of CBE key holders before it is processed<br/>
            </div>
            <FlatButton label="CHANGE NUMBER OF REQUIRED SIGNATURES"
                        style={{marginTop: 16}}
                        labelStyle={globalStyles.flatButtonLabel}
            />
            <div style={styles.itemTitle}>Pending operations</div>
            <Paper>
                <div>
                    <Table>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow displayBorder={false}>
                                <TableHeaderColumn style={{...styles.columns.description, ...styles.tableHeader}}>Description</TableHeaderColumn>
                                <TableHeaderColumn style={{...styles.columns.signatures, ...styles.tableHeader}}>Signatures</TableHeaderColumn>
                                <TableHeaderColumn style={{...styles.columns.view, ...styles.tableHeader}}>Actions</TableHeaderColumn>
                                <TableHeaderColumn style={styles.columns.actions}>&nbsp;</TableHeaderColumn>
                            </TableRow>
                            {pendings.items.map(item =>
                                <TableRow key={item.id} displayBorder={false} style={globalStyles.itemGreyText}>
                                    <TableRowColumn>{item.conf_sign + ' ' + item.type}</TableRowColumn>
                                    <TableRowColumn>{'' + item.needed + ' of ' + pendings.props.signaturesRequired}</TableRowColumn>
                                    <TableRowColumn>
                                        <FlatButton label="VIEW"
                                                    style={{minWidth: 'initial' }}
                                                    labelStyle={globalStyles.flatButtonLabel} />
                                    </TableRowColumn>
                                    <TableRowColumn style={styles.columns.actions}>
                                        <FlatButton label={item.hasConfirmed ? ("REVOKE") : ("SIGN")}
                                                    style={{minWidth: 'initial'}}
                                                    labelStyle={globalStyles.flatButtonLabel}
                                                    onTouchTap={()=>{
                                                        item.hasConfirmed ? handleRevoke(item.conf_sign) : handleConfirm(item.conf_sign);
                                                    }}/>
                                    </TableRowColumn>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
            <div style={styles.itemTitle}>Completed operations</div>
            <Paper>
                <div>
                    <Table>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow displayBorder={false}>
                                <TableHeaderColumn style={{...styles.columns.description, ...styles.tableHeader}}>Description</TableHeaderColumn>
                                <TableHeaderColumn style={{...styles.columns.signatures, ...styles.tableHeader}}>Time</TableHeaderColumn>
                                <TableHeaderColumn style={styles.columns.view}>&nbsp;</TableHeaderColumn>
                                <TableHeaderColumn style={{...styles.columns.actions, ...styles.tableHeader}}>Actions</TableHeaderColumn>
                            </TableRow>
                            {pendings.items.map(item =>
                                <TableRow key={item.id} displayBorder={false} style={globalStyles.itemGreyText}>
                                    <TableRowColumn>{item.conf_sign + ' ' + item.type}</TableRowColumn>
                                    <TableRowColumn colSpan="2">{'' + item.needed + ' of ' + pendings.props.signaturesRequired}</TableRowColumn>
                                    <TableRowColumn>
                                        <FlatButton label="VIEW"
                                                    style={{minWidth: 'initial' }}
                                                    labelStyle={globalStyles.flatButtonLabel} />
                                    </TableRowColumn>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        </PageBase>
    );
};

OperationsPage = connect(mapStateToProps )(OperationsPage);

export default OperationsPage;