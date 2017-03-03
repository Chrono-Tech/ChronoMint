import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IconMenu, IconButton, MenuItem} from 'material-ui';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import {white} from 'material-ui/styles/colors';
import {listNotices} from '../../../redux/ducks/session/data';

const style = {
    cursor: 'default'
};

const mapStateToProps = (state) => ({
    list: state.get('notifier').list
});

const mapDispatchToProps = (dispatch) => ({
    getList: () => dispatch(listNotices())
});

@connect(mapStateToProps, mapDispatchToProps)
class Notices extends Component {
    componentDidMount() {
        this.props.getList();
    }

    render() {
        return (
            <IconMenu color={white}
                      iconButtonElement={<IconButton><NotificationsIcon color={white} /></IconButton>}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                {this.props.list.size > 0 ? (<div>
                    {this.props.list.entrySeq().map(([index, item]) =>
                        <MenuItem key={index} primaryText={item.historyBlock()} style={style}/>
                    )}
                </div>) : (<MenuItem primaryText={'No notifications'} style={style}/>)}
            </IconMenu>
        );
    }
}

export default Notices;