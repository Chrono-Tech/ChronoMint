import React, {Component} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import PageBase from '../pages/PageBase2';
import globalStyles from '../styles';
import {loadLoc} from '../redux/ducks/locs/loc';
import {showLOCModal} from '../redux/ducks/ui/modal';
import {dateFormatOptions} from '../config';

const OngoingStatusBlock = <div style={globalStyles.item.status.block}>
        <div style={globalStyles.item.status.orange}>
            ONGOING<br/>
        </div>
    </div>;

const closedStatusBlock = <div style={globalStyles.item.status.block}>
    <div style={globalStyles.item.status.red}>
        DECLINED<br/>
    </div>
</div>;

const mapStateToProps = (state) => ({
    polls: state.get('locs'),
});

const mapDispatchToProps = (dispatch) => ({
    showLOCModal: locKey => dispatch(showLOCModal(locKey)),
    loadLoc: loc => dispatch(loadLoc(loc)),
});

@connect(mapStateToProps, mapDispatchToProps)
class VotingPage extends Component {

    handleShowPollModal = (locKey) => {
        this.props.loadLoc(locKey);
        this.props.showLOCModal({locKey});
    };

    render() {
        const {polls} = this.props;
        return (
            <PageBase title={<div><span style={{verticalAlign: 'sub'}}>Voting </span> <RaisedButton
                label="NEW POLL"
                primary={true}
                style={{verticalAlign: 'text-bottom', fontSize: 15}}
                onTouchTap={this.handleShowPollModal.bind(null, null)}
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
                        {polls.size} entries
                    </span>
                </div>

                {polls.map( (item, key) => {
                    let expDate = item.expDate();
                    return (
                        <Paper key={key} style={globalStyles.item.paper}>
                            <div>
                                {expDate > new Date().getTime() ? OngoingStatusBlock : closedStatusBlock}
                                <div style={globalStyles.item.title}>{item.get('locName')}</div>
                                <div style={globalStyles.item.greyText}>
                                    Total issued amount: 101010 LHUS<br />
                                    Total redeemed amount: 11101 LHUS<br />
                                    Amount in circulation: 011110 LHUS<br />
                                    Exp date: {new Date(expDate).toLocaleDateString("en-us", dateFormatOptions)}
                                </div>
                                <div style={globalStyles.item.lightGrey}>
                                    Published on {new Date(expDate).toLocaleDateString("en-us", dateFormatOptions)}. {
                                    6} days left. {23}% TIME holders already voted.
                                </div>
                            </div>
                            <div>
                                <FlatButton label="SUPPORT" style={{color: 'grey'}}/>
                                <FlatButton label="DECLINE" style={{color: 'grey'}}/>
                                <FlatButton label="RESULTS" style={{color: 'grey'}}/>
                            </div>
                        </Paper>
                    )
                }).toArray()}
            </PageBase>
        );
    }
}

export default VotingPage;
