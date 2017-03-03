import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Paper, Divider, FloatingActionButton, RaisedButton} from 'material-ui';
import {Table, TableHeader, TableBody, TableHeaderColumn, TableRowColumn, TableRow} from 'material-ui/Table';
import ContentAdd from 'material-ui/svg-icons/content/add';
import globalStyles from '../../../styles';
import {
    listContracts
} from '../../../redux/ducks/settings/otherContracts';
import styles from './styles';

const mapStateToProps = (state) => ({
    list: state.get('settingsOtherContracts').list
});

const mapDispatchToProps = (dispatch) => ({
    getList: () => dispatch(listContracts())
});

@connect(mapStateToProps, mapDispatchToProps)
class OtherContracts extends Component {
    componentDidMount() {
        this.props.getList();
    }

    render() {
        return (
            <Paper style={globalStyles.paper}>
                <h3 style={globalStyles.title}>Other contracts</h3>
                <Divider/>

                <FloatingActionButton style={styles.floatingActionButton}>
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
                                                  type="submit"/>

                                    <RaisedButton label="View"
                                                  style={styles.actionButton}
                                                  type="submit"/>
                                </TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div style={globalStyles.clear}/>
            </Paper>
        );
    }
}

export default OtherContracts;