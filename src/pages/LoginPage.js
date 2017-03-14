import React, {Component} from 'react';
import {
    SelectField,
    MenuItem,
    RaisedButton,
    FlatButton,
    Paper
} from 'material-ui';
import {grey500} from 'material-ui/styles/colors';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Help from 'material-ui/svg-icons/action/help';
import {connect} from 'react-redux';
import {login} from '../redux/ducks/session/data';
import {showRequireAccessModal} from '../redux/ducks/ui/modal';
import CBEDAO from '../dao/CBEDAO';

// TODO: Fix https://github.com/callemall/material-ui/issues/3923

const mapDispatchToProps = (dispatch) => ({
    handleLogin: (account) => dispatch(login(account)),
    handleRequireAccess: (account) => { // TODO Move to action-creator
        CBEDAO.isCBE(account).then(isCBE => {
            if (isCBE) {
                dispatch(login(account));
            } else {
                dispatch(showRequireAccessModal({account}));
            }
        });
    }
});

const styles = {
    loginContainer: {
        minWidth: 320,
        maxWidth: 400,
        height: 'auto',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: 0,
        right: 0,
        margin: 'auto'
    },
    paper: {
        padding: 20,
        overflow: 'hidden'
    },
    buttonsDiv: {
        textAlign: 'center',
        marginTop: 10
    },
    flatButton: {
        color: grey500,
        width: '50%'
    },
    loginBtn: {
        marginTop: 10
    }
};

@connect(null, mapDispatchToProps)
class Login extends Component {
    constructor() {
        super();
        this.state = {
            accounts: CBEDAO.web3.eth.accounts, // TODO use redux state
            selectedAccount: null
        };
    }

    handleChange = (event, index, value) => this.setState({selectedAccount: value});

    handleClick = () => {
        this.props.handleLogin(this.state.selectedAccount);
    };

    render() {
        const {accounts, selectedAccount} = this.state;
        return (
            <div style={styles.loginContainer}>
                <Paper style={styles.paper}>
                    <SelectField
                        floatingLabelText="Ethereum account"
                        value={selectedAccount}
                        onChange={this.handleChange}
                        fullWidth={true}>
                        {accounts.map(a => <MenuItem key={a} value={a} primaryText={a}/>)}
                    </SelectField>

                    <RaisedButton label="Login"
                                  primary={true}
                                  fullWidth={true}
                                  onTouchTap={this.handleClick}
                                  disabled={this.state.selectedAccount === null}
                                  style={styles.loginBtn}/>
                </Paper>

                <div style={styles.buttonsDiv}>
                    <FlatButton
                        label="Require access"
                        style={styles.flatButton}
                        icon={<PersonAdd />}
                        disabled={this.state.selectedAccount === null}
                        onTouchTap={this.props.handleRequireAccess.bind(null, this.state.selectedAccount)}
                    />

                    <FlatButton
                        label="Access problems?"
                        href="/"
                        style={styles.flatButton}
                        icon={<Help />}/>
                </div>
            </div>
        );
    }
}

export default Login;