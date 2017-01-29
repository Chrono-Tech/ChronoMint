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
import {grey500} from 'material-ui/styles/colors';
import PageBase from './PageBase';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Divider from 'material-ui/Divider';
import globalStyles from '../styles';

import {showLOCModal} from '../redux/ducks/modal';

const styles = {
    div: {
        padding: 20
    },
    locName: {
        fontSize: 20
    },
    gray: {
        color: 'gray',
        fontSize: 12
    },
    ongoing: {
        color: 'green'
    },
    inactive: {
        color: 'gray'
    },
    statusBlock: {
        textAlign: 'right'
    },
    filterBlock: {
        textAlign: 'right'
    },
};

const muiTheme = getMuiTheme({
    slider: {
        selectionColor: 'green'
    },
});

const ongoingStatusBlock = <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 " style={styles.statusBlock}>
    <div style={styles.ongoing}>
        ACTIVE<br/>
        {61}%
    </div>
    <div style={{pointerEvents: 'none'}}>
        <MuiThemeProvider muiTheme={muiTheme}>
            <Slider value={0.61} />
        </MuiThemeProvider>
    </div>
</div>;

const closedStatusBlock = <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 " style={styles.statusBlock}>
    <div style={styles.inactive}>
        CLOSED<br/>
        {100}%
    </div>
    <div style={{pointerEvents: 'none'}}>
        <Slider value={1} disabled={true}/>
    </div>
</div>;

const dateFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
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

        const {showLOCModal, locs} = this.props;
        return (
            <PageBase title={<div><span style={{verticalAlign: 'bottom'}}>LOCs </span> <RaisedButton
                label="NEW LOC"
                primary={true}
                style={{fontSize:15}}
                onTouchTap={showLOCModal}
            /></div>} navigation="ChronoMint / LOCs">

                <div className="row">
                    <div className="col-xs-36 col-sm-18 col-md-9 col-lg-9 m-b-45 ">
                        <TextField
                            floatingLabelText="Search by title"
                            fullWidth={true} />
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
                        <RaisedButton
                            label="SEARCH"
                            primary={true}
                            style={{marginTop:24}}
                            //onTouchTap={this.handleSubmitClick.bind(this)}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-36 col-sm-18 col-md-9 col-lg-9 m-b-45 ">
                        8 entries
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 " style={styles.filterBlock}>
                        Show only: .....  Sorted by: .........
                    </div>
                </div>

                {locs.items.map(item =>
                    <div key={item.id}>
                        <div style={styles.div}>
                            <div className="row">
                                <div className="col-xs-36 col-sm-18 col-md-9 col-lg-9 m-b-45 ">
                                    <h2 style={styles.locName}>{item.name}</h2>
                                    <div style={styles.gray}>
                                        {item.address}
                                        {new Date(parseInt(item.expDate)).toLocaleDateString("en-us", dateFormatOptions)}
                                    </div>
                                </div>
                                {item.id === 4 ? ongoingStatusBlock : closedStatusBlock}
                            </div>
                            <div>
                                    <FlatButton label="MORE INFO" primary={true} />
                                    <FlatButton label="VIEW CONTRACT" primary={true} />
                            </div>
                        </div>
                        <Divider/>
                    </div>
                )}
            </PageBase>
        );
    }
}

export default LOCPage;
