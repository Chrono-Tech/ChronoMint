import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import LOCForm from '../forms/LOCForm';
import {grey700} from 'material-ui/styles/colors';
import {connect} from 'react-redux';
import {proposeLOC} from 'redux/ducks/locs';
import globalStyles from '../../styles';

const styles = {
    cancel: {
        color: grey700,
        marginRight: 10
    }
};

const mapDispatchToProps = (dispatch) => ({
    callback: (data, callback) => dispatch(
        () => {
            proposeLOC(data, (address) => {
                // chronoMint.approveContract(address, {from: data['account'], gas: 3000000});
                // chronoMint.approveContract(address, {from: data['account'], gas: 3000000});
            }, dispatch);
        }
    )
});

// const mapStateToProps = (state) => ({
//     locs: state.get('locs')
// });

@connect(null, mapDispatchToProps)
class LOCModal extends Component {
    // constructor() {
    //     super();
    // };

    // handleChange = (event, index, value) => this.setState({selectedAccount: value});

    handleSubmit = (values) => {
        let name = values.get('name');
        let issueLimit = values.get('issueLimit');
        let expDate = values.get('expiration_date').getTime();
        let uploadedFileHash = values.get('uploadedFileHash');
        let account = localStorage.chronoBankAccount;
        console.log(values);
        this.props.callback({name, issueLimit, expDate, uploadedFileHash, account});
        this.props.hideModal();
    };

    handleSubmitClick = () => {
        this.refs.LOCForm.submit();
    };

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {title, open} = this.props;
        const actions = [
            <FlatButton
                label="Cancel"
                style={styles.cancel}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label="Submit"
                buttonStyle={globalStyles.cyanRaisedButton}
                labelStyle={globalStyles.cyanRaisedButtonLabel}
                onTouchTap={this.handleSubmitClick.bind(this)}
            />,
        ];

        return (
            <Dialog
                title={title || "LOC Form"}
                actions={actions}
                modal={true}
                open={open}>

                <LOCForm ref="LOCForm" onSubmit={this.handleSubmit} />
            </Dialog>
        );
    }
}

export default LOCModal;