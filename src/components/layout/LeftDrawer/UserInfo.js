import React, {Component} from 'react';
import {connect} from 'react-redux';
import Avatar from 'material-ui/Avatar';
import PersonIcon from 'material-ui/svg-icons/social/person';

const style = {
    div: {
        padding: '24px 24px 8px 24px',
        //backgroundImage:  'url(' + require('../../../assets/LH-main-background.png') + ')',
        backgroundColor: '#fff',
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
        lineHeight: '20px'
    },
    email: {
        display: 'block',
        fontWeight: 400,
        fontSize: 14,
        lineHeight: '20px'
    }
};

const mapStateToProps = (state) => ({
    user: state.get('session')
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