import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import LOCForm from 'components/forms/LOCForm';
// import {connect} from 'react-redux';
import {proposeLOC, editLOC, removeLOC} from '../../redux/ducks/locs';
import globalStyles from '../../styles';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

// const mapDispatchToProps = (dispatch) => ({
//     callback: (data, callback) => dispatch(
//         () => {
//             proposeLOC(data, (address) => {
//                 // chronoMint.approveContract(address, {from: data['account'], gas: 3000000});
//                 // chronoMint.approveContract(address, {from: data['account'], gas: 3000000});
//             }, dispatch);
//         }
//     )
// });

// const mapStateToProps = (state) => ({
//     locs: state.get('locs')
// });

// @connect(null, mapDispatchToProps)
class LOCModal extends Component {
    // constructor() {
    //     super();
    // };

    // handleChange = (event, index, value) => this.setState({selectedAccount: value});

    handleSubmit = (values) => {
        let account = localStorage.chronoBankAccount;
        let address = values.get('address');
        if (!address) {
            proposeLOC({values, account});
        } else {
            editLOC({values, account, address});
        }
        //this.props.callback({name, issueLimit, expDate, publishedHash, account});
        this.props.hideModal();
    };

    handleSubmitClick = () => {
        this.refs.LOCForm.submit();
    };

    handleDeleteClick = () => {
        let address = this.refs.LOCForm.props.loc.address;
        removeLOC({address});
        this.props.hideModal();
    };

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open, loc, pristine, submitting} = this.props;
        const actions = [
            loc?<FlatButton
                label="Delete LOC"
                style={{...globalStyles.flatButton, float: 'left'}}
                labelStyle={globalStyles.flatButtonLabel}
                onTouchTap={this.handleDeleteClick.bind(this)}
            />:"",
            <FlatButton
                label="Cancel"
                style={globalStyles.flatButton}
                labelStyle={globalStyles.flatButtonLabel}
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label={loc?"Save changes":"Create LOC"}
                buttonStyle={globalStyles.raisedButton}
                labelStyle={globalStyles.raisedButtonLabel}
                primary={true}
                onTouchTap={this.handleSubmitClick.bind(this)}
                disabled={pristine || submitting}
            />,
        ];

        return (
            <Dialog
                title={<div>
                    New LOC
                    <IconButton style={{float: 'right', margin: "-12px -12px 0px"}} onTouchTap={this.handleClose}>
                        <NavigationClose />
                    </IconButton>
                </div>}
                actions={actions}
                actionsContainerStyle={{padding:26}}
                titleStyle={{paddingBottom:10}}
                modal={true}
                open={open}>
                <div style={globalStyles.modalGreyText}>
                    This operation must be co-signed by other CBE key holders before it is executed.
                </div>
                <LOCForm ref="LOCForm" onSubmit={this.handleSubmit} loc={loc} />
            </Dialog>
        );
    }
}

export default LOCModal;