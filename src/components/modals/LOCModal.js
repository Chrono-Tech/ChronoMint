import {connect} from 'react-redux';
import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import BigNumber from 'bignumber.js';
import LOCForm from '../forms/LOCForm/LOCForm';
import {proposeLOC, updateLOC, removeLOC} from '../../redux/ducks/locs/data';
import globalStyles from '../../styles';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import LocModel from '../../models/LocModel'
// import {passLocAddress} from '../../redux/ducks/loc/';

const mapStateToProps = state => {
    const loc = state.get('locs').get(state.get('loc'));
    const initialFormValues = (loc || new LocModel()).toJS();

    return ({
        initialFormValues
    })
};

const mapDispatchToProps = (dispatch) => ({
    updateLOC: (params) => dispatch(updateLOC(params)),
});

@connect(mapStateToProps, mapDispatchToProps)
class LOCModal extends Component {

    handleSubmit = (values) => {
        let account = localStorage.getItem('chronoBankAccount');
        let locAddress = values.get('address');
        let jsValues = values.toJS();
        jsValues = {...jsValues, expDate: new BigNumber(jsValues.expDate.getTime()), issueLimit: new BigNumber(jsValues.issueLimit)}
        if (!locAddress) {
            proposeLOC({...jsValues, account});
        } else {
            let changedProps = {};
            const x = this.props.initialFormValues;
            for(let key in jsValues) {
                if (jsValues.hasOwnProperty(key) && +jsValues[key] !== +x[key] && jsValues[key] !== x[key]){
                    changedProps[key] = jsValues[key];
                }
            }
            this.props.updateLOC({...changedProps, account, locAddress});
        }
        this.props.hideModal();
    };

    handleSubmitClick = () => {
        this.refs.LOCForm.getWrappedInstance().submit();
    };

    handleDeleteClick = () => {
        let address = this.refs.LOCForm.getWrappedInstance().values.get('address');
        removeLOC(address);
        this.props.hideModal();
    };

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open, locKey, pristine, submitting} = this.props;
        const actions = [
            locKey?<FlatButton
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
                label={locKey?"Save changes":"Create LOC"}
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
                    {locKey?"Edit LOC":"New LOC"}
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
                <LOCForm ref="LOCForm" onSubmit={this.handleSubmit} />
            </Dialog>
        );
    }
}

export default LOCModal;