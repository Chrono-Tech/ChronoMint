import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, TableBody, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import PageBase from './PageBase2';
import {revoke, confirm} from '../redux/ducks/pendings/data';
import {confirmationWatch, confirmationGet} from '../redux/ducks/completedOperations/data';
import {getPropsOnce} from '../redux/ducks/pendings/operationsProps/data';
import {getPendingsOnce} from '../redux/ducks/pendings/data';
import globalStyles from '../styles';
import withSpinner from '../hoc/withSpinner';

const mapStateToProps = (state) => ({
    pendings: state.get('pendings'),
    operationsProps: state.get('operationsProps'),
    completed: state.get('completedOperations'),
    locs: state.get('locs'),
    isFetching: state.get('pendingsCommunication').isFetching,
});

const handleRevoke = (operation) => {
    revoke({operation}, localStorage.chronoBankAccount);
};

const handleConfirm = (operation) => {
    confirm({operation}, localStorage.chronoBankAccount);
};

const mapDispatchToProps = (dispatch) => ({
    getPendingsOnce: () => dispatch(getPendingsOnce()),
});

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
class OperationsPage extends Component {
    constructor(props) {
        super(props);
        confirmationWatch();
        confirmationGet();
        getPropsOnce();
    }
    componentWillMount(){
        this.props.getPendingsOnce();
    }
    render() {
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
        const {pendings, operationsProps, completed, locs} = this.props;
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
                                    <TableHeaderColumn
                                        style={{...styles.columns.view, ...styles.tableHeader}}>Actions</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.columns.actions}>&nbsp;</TableHeaderColumn>
                                </TableRow>
                                {pendings.map((item, key) => {
                                        const signaturesRequired = operationsProps.get('signaturesRequired').toNumber();
                                        const signatures = signaturesRequired - item.needed();
                                        const operation = item.get('operation');
                                        const hasConfirmed = item.get('hasConfirmed');
                                        let loc = locs.get(item.targetAddress());
                                        let objName = loc ? loc.get('locName') : item.targetAddress();
                                        let description = item.type() + ' / ' + item.functionName() + '(' + item.functionArgs() + '): ' + objName;

                                        return (
                                            <TableRow key={key} displayBorder={false} style={globalStyles.item.greyText}>
                                                <TableRowColumn>{description}</TableRowColumn>
                                                <TableRowColumn>{'' + signatures + ' of ' + signaturesRequired}</TableRowColumn>
                                                <TableRowColumn>
                                                    <FlatButton label="VIEW"
                                                                style={{minWidth: 'initial' }}
                                                                labelStyle={globalStyles.flatButtonLabel}/>
                                                </TableRowColumn>
                                                <TableRowColumn style={styles.columns.actions}>
                                                    <FlatButton label={ hasConfirmed ? ("REVOKE") : ("SIGN")}
                                                                style={{minWidth: 'initial'}}
                                                                labelStyle={globalStyles.flatButtonLabel}
                                                                onTouchTap={()=>{
                                                        (hasConfirmed ? handleRevoke : handleConfirm) (operation);
                                                    }}/>
                                                </TableRowColumn>
                                            </TableRow>
                                        )
                                    }
                                ).toArray()}
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
                                    <TableHeaderColumn style={{...styles.columns.description, ...styles.tableHeader}}>Operation</TableHeaderColumn>
                                    <TableHeaderColumn style={{...styles.columns.signatures, ...styles.tableHeader}}>Time</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.columns.view}>&nbsp;</TableHeaderColumn>
                                    <TableHeaderColumn style={{...styles.columns.actions, ...styles.tableHeader}}>Actions</TableHeaderColumn>
                                </TableRow>
                                {completed.map((item, key) =>
                                    item.needed() ? null :
                                        <TableRow key={key} displayBorder={false} style={globalStyles.item.greyText}>
                                            <TableRowColumn>{item.get('operation')}</TableRowColumn>
                                            <TableRowColumn colSpan="2">{'00:00'}</TableRowColumn>
                                            <TableRowColumn>
                                                <FlatButton label="VIEW"
                                                            style={{minWidth: 'initial' }}
                                                            labelStyle={globalStyles.flatButtonLabel}/>
                                            </TableRowColumn>
                                        </TableRow>
                                ).toArray()}
                            </TableBody>
                        </Table>
                    </div>
                </Paper>
            </PageBase>
        );
    }
}

export default OperationsPage;