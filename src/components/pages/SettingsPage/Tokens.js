import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, TableHeader, TableBody, TableHeaderColumn, TableRowColumn, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import globalStyles from '../../../styles';
import {
    listTokens
} from '../../../redux/ducks/settings/tokens';
import styles from './styles';

const mapStateToProps = (state) => ({
    list: state.get('settingsTokens').list
});

const mapDispatchToProps = (dispatch) => ({
    getList: () => dispatch(listTokens())
});

@connect(mapStateToProps, mapDispatchToProps)
class Tokens extends Component {
    componentDidMount() {
        this.props.getList();
    }

    render() {
        return (
            <Paper style={globalStyles.paper}>
                <h3 style={globalStyles.title}>Tokens</h3>
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
                                    <RaisedButton label="View"
                                                  style={styles.actionButton}
                                                  type="submit"/>

                                    <RaisedButton label="Modify"
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

export default Tokens;