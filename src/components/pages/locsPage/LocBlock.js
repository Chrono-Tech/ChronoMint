import React, {Component} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import globalStyles from '../../../styles';
import {dateFormatOptions} from '../../../config';
import Slider from '../../common/slider';
import {handleShowLOCModal, handleShowIssueLHModal} from './handlers';

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

const mapDispatchToProps = (dispatch) => ({
    showLOCModal: locKey => dispatch(handleShowLOCModal(locKey)),
    showIssueLHModal: locKey => dispatch(handleShowIssueLHModal(locKey)),
});

@connect(null, mapDispatchToProps)
class LocBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {value: 1};
    }

    render() {
        const {item, showLOCModal, showIssueLHModal} = this.props;
        const address = item.get('address');
        const issueLimit = item.issueLimit();
        const expDate = item.expDate();
        return (
            <Paper style={globalStyles.item.paper}>
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
                                onTouchTap={()=>{showLOCModal(address);}}
                    />
                    <FlatButton label="ISSUE LH" style={{color: 'grey'}}
                                onTouchTap={()=>{showIssueLHModal(address);}}
                    />
                    <FlatButton label="REDEEM LH" style={{color: 'grey'}}
                                onTouchTap={()=>{showLOCModal(address);}}
                    />
                    <FlatButton label="EDIT LOC INFO" style={{color: 'grey'}}
                                onTouchTap={()=>{showLOCModal(address);}}
                    />
                </div>
            </Paper>
        );
    }
}

export default LocBlock;