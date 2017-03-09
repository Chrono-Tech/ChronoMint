import React, {Component} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PageBase from '../pages/PageBase2';
import globalStyles from '../styles';
import Slider from '../components/common/slider';
import {loadLoc} from '../redux/ducks/locs/loc';
import {getLOCsOnce} from '../redux/ducks/locs/data';
import {showLOCModal} from '../redux/ducks/ui/modal';
import {showIssueLHModal} from '../redux/ducks/ui/modal';
import {dateFormatOptions} from '../config';

const styles = {
    filterMenu: {
        margin: "-15px -25px"
    },
};

const OngoingStatusBlock = (props) => (
    <div style={globalStyles.item.status.block}>
        <div style={globalStyles.item.status.green}>
            ACTIVE<br/>
        </div>
        <Slider value={props.value} cyan={true} />
    </div>
);

const closedStatusBlock = <div style={globalStyles.item.status.block}>
    <div style={globalStyles.item.status.grey}>
        INACTIVE<br/>
    </div>
    <Slider value={1} disabled={true}/>
</div>;

const mapStateToProps = (state) => ({
    locs: state.get('locs'),
});

const mapDispatchToProps = (dispatch) => ({
    showLOCModal: locKey => dispatch(showLOCModal(locKey)),
    showIssueLHModal: locKey => dispatch(showIssueLHModal(locKey)),
    loadLoc: loc => dispatch(loadLoc(loc)),
    getLOCsOnce: () => dispatch(getLOCsOnce()),
});

@connect(mapStateToProps, mapDispatchToProps)
class LOCPage extends Component {

    constructor(props) {
        super(props);
        this.state = {value: 1};
    }

    componentWillMount(){
        this.props.getLOCsOnce();
    }

    handleChange = (event, index, value) => this.setState({value});

    handleShowLOCModal = (locKey) => {
        this.props.loadLoc(locKey);
        this.props.showLOCModal({locKey});
    };

    handleShowIssueLHModal = (locKey) => {
        this.props.loadLoc(locKey);
        this.props.showIssueLHModal({locKey});
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
                        {locs.size} entries
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
                    let issueLimit = item.issueLimit();
                    let expDate = item.expDate();
                    return (
                        <Paper key={key} style={globalStyles.item.paper}>
                            <div>
                                {expDate > new Date().getTime() ? <OngoingStatusBlock value={
                                    (((7776000000 - expDate) + new Date().getTime()) / 7776000000).toFixed(2)
                                }/> : closedStatusBlock}
                                <div style={globalStyles.item.title}>{item.get('locName')}</div>
                                <div style={globalStyles.item.greyText}>
                                    Issue limit: {issueLimit} LHUS<br />
                                    Total issued amount: {item.issued()} LHUS<br />
                                    Total redeemed amount: {item.redeemed()} LHUS<br />
                                    Amount in circulation: {item.issued() - item.redeemed()} LHUS<br />
                                    Exp date: {new Date(expDate).toLocaleDateString("en-us", dateFormatOptions)}<br />
                                    {item.get('address')}
                                </div>
                                <div style={globalStyles.item.lightGrey}>
                                    Added on {new Date(expDate).toLocaleDateString("en-us", dateFormatOptions)}
                                </div>
                            </div>
                            <div>
                                <FlatButton label="VIEW CONTRACT" style={{color: 'grey'}}
                                            onTouchTap={()=>{this.handleShowLOCModal(key);}}
                                />
                                <FlatButton label="ISSUE LH" style={{color: 'grey'}}
                                            onTouchTap={()=>{this.handleShowIssueLHModal(key);}}
                                />
                                <FlatButton label="REDEEM LH" style={{color: 'grey'}}
                                            onTouchTap={()=>{this.handleShowLOCModal(key);}}
                                />
                                <FlatButton label="EDIT LOC INFO" style={{color: 'grey'}}
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
