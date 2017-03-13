import React from 'react';
import globalStyles from '../../../../styles';
import Slider from '../../../common/slider';

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

const StatusBlock = (props) => (
    props.expDate > new Date().getTime() ?
        <OngoingStatusBlock value={
            (((7776000000 - props.expDate) + new Date().getTime()) / 7776000000).toFixed(2)
        }/> : closedStatusBlock
);

export default StatusBlock