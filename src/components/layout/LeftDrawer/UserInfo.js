import React, {Component} from 'react';
import {connect} from 'react-redux';
import Avatar from 'material-ui/Avatar';
import PersonIcon from 'material-ui/svg-icons/social/person';

import {white, darkWhite} from 'material-ui/styles/colors';

const style = {
    div: {
        padding: '24px 24px 8px 24px',
        backgroundImage:  'url(' + require('../../../assets/drawer_bg.svg') + ')',
        backgroundColor: '#fff',
        boxShadow: 'rgba(0, 0, 0, 0.5) 0 0 10px inset',
        height: 112
    },
    icon: {
        display: 'block'
    },
    username: {
        marginTop: 8,
        display: 'block',
        fontWeight: 500,
        fontSize: 14,
        color: white,
        lineHeight: '20px'
    },
    email: {
        display: 'block',
        fontWeight: 400,
        fontSize: 14,
        color: darkWhite,
        lineHeight: '20px'
    }
};

const mapStateToProps = (state) => ({
    user: state.get('sessionData')
});

@connect(mapStateToProps, null)
class UserInfo extends Component {
    render() {
        const {name, email} = this.props.user.profile;
        return (
            <div style={style.div}>
                <Avatar size={56} icon={<PersonIcon />} />
                <span style={style.username}>{name}</span>
                <span style={style.email}>{email}</span>
            </div>
        )
    }
}

export default UserInfo;