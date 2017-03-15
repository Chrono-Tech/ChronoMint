import React from 'react';
import globalStyles from '../../../../styles';
import Slider from '../../../common/slider';

const Status = ['MAINTENANCE', 'ACTIVE', 'SUSPENDED', 'BANKRUPT', 'INACTIVE'];

const OngoingStatusBlock = (props) => (
    <div style={globalStyles.item.status.block}>
        <div style={globalStyles.item.status.green}>
            {Status[props.status]}<br/>
        </div>
        <Slider value={props.value} cyan={true} />
    </div>);

const ClosedStatusBlock = (props) => (
    <div style={globalStyles.item.status.block}>
        <div style={globalStyles.item.status.grey}>
            {Status[props.status]}<br/>
        </div>
        <Slider value={props.value} disabled={true}/>
    </div>);

const StatusBlock = (props) => {
    const value = (((7776000000 - props.expDate) + new Date().getTime()) / 7776000000).toFixed(2);
    return ( props.expDate > new Date().getTime() ?
            props.status === 1 ?
                <OngoingStatusBlock value={value} status={props.status} /> :
                <ClosedStatusBlock value={value} status={props.status} /> :
            <ClosedStatusBlock value={1} status={4} />
    )
};

export default StatusBlock