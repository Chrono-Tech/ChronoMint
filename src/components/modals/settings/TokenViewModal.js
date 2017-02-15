import React, {Component} from 'react';
import {connect} from 'react-redux';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Dialog, IconButton, TextField, FlatButton} from 'material-ui';
import {Table, TableHeader, TableBody, TableHeaderColumn, TableRowColumn, TableRow} from 'material-ui/Table';
import Pagination from '../../../components/common/Pagination';
import {
    listBalances
} from '../../../redux/ducks/settings/tokens';
import globalStyles from '../../../styles';
import styles from '../styles';

const mapStateToProps = (state) => ({
    token: state.get('settingsTokens').selected, /** @see TokenModel **/
    balances: state.get('settingsTokens').balances,
    balancesPageCount: state.get('settingsTokens').balancesPageCount
});

const mapDispatchToProps = (dispatch) => ({
    listBalances: (page, address) => dispatch(listBalances(page, address))
});

@connect(mapStateToProps, mapDispatchToProps)
class TokenViewModal extends Component {
    handleClose = () => {
        this.props.hideModal();
    };

    handlePageClick = (pages) => {
        this.props.listBalances(pages.selected);
    };

    handleFilterBlur = () => {
        if (this.filterAddress != this.refs.FilterByAddress.input.value) {
            this.filterAddress = this.refs.FilterByAddress.input.value;
            if (this.filterAddress == '') {
                this.filterAddress = null;
            }
            this.props.listBalances(0, this.filterAddress);
        }
    };

    render() {
        return (
            <Dialog
                title={<div>
                    View {this.props.token.symbol()} &ndash; {this.props.token.name()}
                    <IconButton style={styles.close} onTouchTap={this.handleClose}><NavigationClose /></IconButton>
                </div>}
                actionsContainerStyle={styles.container}
                titleStyle={styles.title}
                modal={true}
                open={this.props.open}>

                <p style={{float: 'left'}}>Total supply: <b>{this.props.token.totalSupply()}</b></p>

                <div style={{float: 'right'}}>
                    <TextField ref="FilterByAddress" onBlur={this.handleFilterBlur}
                               hintText="Filter by address" style={{width: '400px'}}/>
                    <FlatButton label={'filter'}/>
                </div>

                <div style={globalStyles.clear}/>

                {this.props.balances.size > 0 || this.props.balancesPageCount > 1 ? (
                        <div>
                            <div style={{maxHeight: '330px', overflow: 'scroll'}}>
                                <Table>
                                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                        <TableRow>
                                            <TableHeaderColumn>Wallet address</TableHeaderColumn>
                                            <TableHeaderColumn>Balance</TableHeaderColumn>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody displayRowCheckbox={false}>
                                        {this.props.balances.entrySeq().map(([address, balance]) =>
                                            <TableRow key={address}>
                                                <TableRowColumn>{address}</TableRowColumn>
                                                <TableRowColumn>{balance}</TableRowColumn>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {this.props.balancesPageCount > 1 ? (
                                    <Pagination pageCount={this.props.balancesPageCount}
                                                marginPagesDisplayed={1}
                                                pageRangeDisplayed={5}
                                                onPageChange={this.handlePageClick}/>
                                ) : []}
                        </div>
                    ) : (
                        <div>No user balances.</div>
                    )}
            </Dialog>
        );
    }
}

export default TokenViewModal;