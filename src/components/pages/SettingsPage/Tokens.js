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
    removeToken,
    removeTokenToggle,
    hideTokenError
} from '../../../redux/ducks/settings/tokens';
import TokenContractModel from '../../../models/contracts/TokenContractModel';
import styles from './styles';

const customStyles = {
    columns: {
        name: {
            width: '15%'
        },
        address: {
            width: '55%'
        },
        action: {
            width: '295px'
        }
    }
};

const mapStateToProps = (state) => ({
    list: state.get('settingsTokens').list,
    ready: state.get('settingsTokens').ready,
    error: state.get('settingsTokens').error,
    removeState: state.get('settingsTokens').remove,
    selected: state.get('settingsTokens').selected
});

const mapDispatchToProps = (dispatch) => ({
    getList: () => dispatch(listTokens()),
    view: (token: TokenContractModel) => dispatch(viewToken(token)),
    form: (token: TokenContractModel) => dispatch(formToken(token)),
    removeToggle: (token: TokenContractModel = null) => dispatch(removeTokenToggle(token)),
    remove: (token: TokenContractModel) => dispatch(removeToken(token, localStorage.getItem('chronoBankAccount'))),
    hideError: () => dispatch(hideTokenError())
});

@connect(mapStateToProps, mapDispatchToProps)
class Tokens extends Component {
    componentDidMount() {
        if (!this.props.ready) {
            this.props.getList();
        }
    }

    render() {
        return (
            <Paper style={globalStyles.paper}>
                <h3 style={globalStyles.title}>Tokens</h3>
                <Divider/>

                <FloatingActionButton style={styles.floatingActionButton}
                                      onTouchTap={this.props.form.bind(this, new TokenContractModel())}>
                    <ContentAdd />
                </FloatingActionButton>

                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={customStyles.columns.name}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={customStyles.columns.address}>Smart contract address</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.action}>Action</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.props.list.entrySeq().map(([index, item]) =>
                            <TableRow key={index}>
                                <TableRowColumn style={customStyles.columns.name}>{item.symbol()}</TableRowColumn>
                                <TableRowColumn style={customStyles.columns.address}>
                                    <p>Asset: {item.address()}</p>
                                    <p>Proxy: {item.proxyAddress()}</p>
                                </TableRowColumn>
                                <TableRowColumn style={customStyles.columns.action}>
                                    <RaisedButton label="View"
                                                  style={styles.actionButton}
                                                  onTouchTap={this.props.view.bind(this, item)}/>

                                    <RaisedButton label="Modify"
                                                  style={styles.actionButton}
                                                  onTouchTap={this.props.form.bind(this, item)}/>

                                    <RaisedButton label="Remove"
                                                  style={styles.actionButton}
                                                  onTouchTap={this.props.removeToggle.bind(this, item)}/>
                                </TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Dialog
                    title="Remove token"
                    actions={[
                          <FlatButton
                            label="Cancel"
                            primary={true}
                            onTouchTap={this.props.removeToggle.bind(null, null)}
                          />,
                          <FlatButton
                            label="Remove"
                            primary={true}
                            keyboardFocused={true}
                            onTouchTap={this.props.remove.bind(null, this.props.selected)}
                          />,
                        ]}
                    modal={false}
                    open={this.props.removeState}
                    onRequestClose={this.props.removeToggle.bind(null, null)}
                >
                    Do you really want to remove token
                    "{this.props.selected.symbol()} &ndash; {this.props.selected.name()}"
                    with asset address "{this.props.selected.address()}"
                    and proxy address "{this.props.selected.proxyAddress()}"?
                </Dialog>

                <Dialog
                    actions={[
                          <FlatButton
                            label="Close"
                            primary={true}
                            onTouchTap={this.props.hideError.bind(null)}
                          />
                        ]}
                    modal={false}
                    open={!!this.props.error}
                    onRequestClose={this.props.hideError.bind(null)}
                >
                    Error occurred while processing your request.
                    Asset or proxy contract at "{this.props.error}" not found or already added.
                </Dialog>

                <div style={globalStyles.clear}/>
            </Paper>
        );
    }
}

export default Tokens;