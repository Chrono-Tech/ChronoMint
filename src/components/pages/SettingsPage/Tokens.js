import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dialog, Paper, Divider, FlatButton, FloatingActionButton, RaisedButton} from 'material-ui';
import {Table, TableHeader, TableBody, TableHeaderColumn, TableRowColumn, TableRow} from 'material-ui/Table';
import ContentAdd from 'material-ui/svg-icons/content/add';
import globalStyles from '../../../styles';
import {
    listTokens,
    viewToken,
    formToken,
    hideError
} from '../../../redux/ducks/settings/tokens';
import TokenModel from '../../../models/TokenModel';
import styles from './styles';

const mapStateToProps = (state) => ({
    list: state.get('settingsTokens').list,
    error: state.get('settingsTokens').error
});

const mapDispatchToProps = (dispatch) => ({
    getList: () => dispatch(listTokens()),
    view: (token: TokenModel) => dispatch(viewToken(token)),
    form: (token: TokenModel) => dispatch(formToken(token)),
    hideError: () => dispatch(hideError())
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

                <FloatingActionButton style={styles.floatingActionButton}
                                      onTouchTap={this.props.form.bind(this, new TokenModel)}>
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
                                <TableRowColumn style={styles.columns.name}>{item.symbol()}</TableRowColumn>
                                <TableRowColumn style={styles.columns.address}>{item.address()}</TableRowColumn>
                                <TableRowColumn style={styles.columns.action}>
                                    <RaisedButton label="Modify"
                                                  style={styles.actionButton}
                                                  onTouchTap={this.props.form.bind(this, item)}
                                                  type="submit"/>

                                    <RaisedButton label="View"
                                                  style={styles.actionButton}
                                                  type="submit"
                                                  onTouchTap={this.props.view.bind(this, item)}/>
                                </TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Dialog
                    actions={[
                          <FlatButton
                            label="Close"
                            primary={true}
                            onTouchTap={this.props.hideError.bind(null)}
                          />
                        ]}
                    modal={false}
                    open={this.props.error !== false}
                    onRequestClose={this.props.hideError.bind(null)}
                >
                    Error occurred while processing your request.
                    Contract not found at "{this.props.error}".
                </Dialog>

                <div style={globalStyles.clear}/>
            </Paper>
        );
    }
}

export default Tokens;