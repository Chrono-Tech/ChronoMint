import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';

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

class UserInfo extends Component {
    render() {
        const username = 'CBE Admin';
        const email = 'admin@chronobank.io';
        return (
            <div style={style.div}>
                <Avatar src="http://www.material-ui.com/images/uxceo-128.jpg"
                        size={56}
                        style={style.icon}/>
                <span style={style.username}>{username}</span>
                <span style={style.email}>{email}</span>
            </div>
        )
    }
}

export default UserInfo;