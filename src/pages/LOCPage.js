import React, {Component} from 'react';
import {connect} from 'react-redux';
import PageBase from 'pages/PageBase2';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import globalStyles from '../styles';
import Slider from '../components/common/slider';
import {grey400} from 'material-ui/styles/colors';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {loadLoc} from '../redux/ducks/locs/loc';
import {showLOCModal} from '../redux/ducks/ui/modal';

const styles = {
    locName: {
        fontSize: 19,
    },
    lightGrey: {
        color: grey400,
        fontSize: 12,
        padding: '10px 0px',
    },
    ongoing: {
        color: 'green'
    },
    inactive: {
        color: 'gray'
    },
    statusBlock: {
        textAlign: 'right',
        width: 130,
        float: 'right',
    },
    filterBlock: {
        textAlign: 'right'
    },
    filterMenu: {
        margin: "-15px -25px"
    },
};

const OngoingStatusBlock = (props) => (
    <div style={styles.statusBlock}>
        <div style={styles.ongoing}>
            ACTIVE<br/>
        </div>
        <Slider value={props.value} cyan={true} />
    </div>
);

const closedStatusBlock = <div style={styles.statusBlock}>
    <div style={styles.inactive}>
        INACTIVE<br/>
    </div>
    <Slider value={1} disabled={true}/>
</div>;

const dateFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
};

const mapStateToProps = (state) => ({
    locs: state.get('locs'),
});

const mapDispatchToProps = (dispatch) => ({
    showLOCModal: locKey => dispatch(showLOCModal(locKey)),
    loadLoc: loc => dispatch(loadLoc(loc)),
});

@connect(mapStateToProps, mapDispatchToProps)
class LOCPage extends Component {

    constructor(props) {
        super(props);
        this.state = {value: 1};
    }

    handleChange = (event, index, value) => this.setState({value});

    handleShowLOCModal = (locKey) => {
        this.props.loadLoc(locKey);
        this.props.showLOCModal({locKey});
    };

    render() {
        const {locs} = this.props;
        return (
            <PageBase title={<div><span style={{verticalAlign: 'sub'}}>LOCs </span> <RaisedButton
                label="NEW LOC"
                primary={true}
                style={{verticalAlign: 'text-bottom', fontSize: 15}}
                onTouchTap={this.handleShowLOCModal.bind(null, null)}
                buttonStyle={{...globalStyles.raisedButton, }}
                labelStyle={globalStyles.raisedButtonLabel}
            />
            </div>}>

                <TextField
                    floatingLabelText="Search by title"
                    style={{width: 'calc(100% - 98px)'}}
                    //fullWidth={true}
                />
                <RaisedButton
                    label="SEARCH"
                    primary={true}
                    buttonStyle={globalStyles.raisedButton}
                    style={{marginTop: 33, width: 88, float: 'right'}}
                    labelStyle={globalStyles.raisedButtonLabel}
                    //onTouchTap={this.handleSubmitClick.bind(this)}
                />

                <div style={{ minWidth: 300}}>
                    <span>
                        {locs.length} entries
                    </span>
                    <span style={{ float: 'right'}}>
                        <span style={{verticalAlign: 'top'}}>Show only: </span>
                        <DropDownMenu value={this.state.value} onChange={this.handleChange} style={styles.filterMenu} underlineStyle={{borderTop: 'none',}}>
                            <MenuItem value={1} primaryText="LHUS" />
                            <MenuItem value={2} primaryText="LHEU" />
                            <MenuItem value={3} primaryText="LHAU" />
                        </DropDownMenu>
                        <span style={{verticalAlign: 'top'}}> Sorted by: </span>
                        <DropDownMenu value={this.state.value} onChange={this.handleChange} style={styles.filterMenu} underlineStyle={{borderTop: 'none',}}>
                            <MenuItem value={1} primaryText="Time added" />
                            <MenuItem value={2} primaryText="Time added" />
                            <MenuItem value={3} primaryText="Time added" />
                        </DropDownMenu>
                    </span>
                </div>

                {locs.map( (item, key) => {
                    let issueLimit = item.get('issueLimit').toNumber();
                    let expDate = item.get('expDate').toNumber();
                    return (
                        <Paper key={key} style={globalStyles.itemsPaper}>
                            <div>
                                {expDate > new Date().getTime() ? <OngoingStatusBlock value={
                                    (((7776000000 - expDate) + new Date().getTime()) / 7776000000).toFixed(2)
                                }/> : closedStatusBlock}
                                <div style={styles.locName}>{item.get('locName')}</div>
                                <div style={globalStyles.itemGreyText}>
                                    Total issued amount: {issueLimit} LHUS<br />
                                    Total redeemed amount: {issueLimit} LHUS<br />
                                    Amount in circulation: {issueLimit} LHUS<br />
                                    Exp date: {new Date(expDate).toLocaleDateString("en-us", dateFormatOptions)}<br />
                                    {item.get('address')}
                                </div>
                                <div style={styles.lightGrey}>
                                    Added on {new Date(expDate).toLocaleDateString("en-us", dateFormatOptions)}
                                </div>
                            </div>
                            <div>
                                <FlatButton label="MORE INFO" style={{color: 'grey'}}/>
                                <FlatButton label="VIEW CONTRACT" style={{color: 'grey'}}
                                            onTouchTap={()=>{this.handleShowLOCModal(key);}}
                                />
                            </div>
                        </Paper>
                    )
                }).toArray()}
            </PageBase>
        );
    }
}

export default LOCPage;
