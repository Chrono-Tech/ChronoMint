import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentCreate from 'material-ui/svg-icons/content/create';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {pink500, grey500} from 'material-ui/styles/colors';
import PageBase from './PageBase';
//import Data from '../data';

import {showLOCModal} from '../redux/ducks/modal';

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
            width: '10%'
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
            width: '10%'
        }
    }
};

const mapStateToProps = (state) => ({
    locs: state.get('locs'),
    locsConnection: state.get('locsConnection'),
});

const mapDispatchToProps = (dispatch) => ({
    showLOCModal: (id) => dispatch(showLOCModal(id))
});

@connect(mapStateToProps, mapDispatchToProps)
class LOCPage extends Component {
    render() {
        const iconButtonElement = (
            <IconButton touch={true}>
                <MoreVertIcon />
            </IconButton>
        );

        const {showLOCModal,locs} = this.props;
        return (
            <PageBase title="LOCs List" navigation="ChronoMint / LOCs List">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn style={styles.columns.id}>ID</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.name}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.price}>Price</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.category}>Category</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.edit} />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locs.items.map(item =>
                            <TableRow key={item.id}>
                                <TableRowColumn style={styles.columns.id}>{item.id}</TableRowColumn>
                                <TableRowColumn style={styles.columns.name}>{item.name}</TableRowColumn>
                                <TableRowColumn style={styles.columns.price}>{item.price}</TableRowColumn>
                                <TableRowColumn style={styles.columns.category}>{item.category}</TableRowColumn>
                                <TableRowColumn style={styles.columns.edit}>
                                    <IconMenu iconButtonElement={iconButtonElement}>
                                        <MenuItem
                                            leftIcon={<ContentCreate />}
                                            onTouchTap={showLOCModal.bind(null, item.id)}>
                                            Edit
                                        </MenuItem>
                                        <MenuItem leftIcon={<ActionDelete />}>Delete</MenuItem>
                                    </IconMenu>
                                </TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <FloatingActionButton
                    style={styles.floatingActionButton}
                    onTouchTap={showLOCModal}
                    backgroundColor={grey500}>
                    <ContentAdd />
                </FloatingActionButton>
            </PageBase>
        );
    }
};

export default LOCPage;
