import {connect} from 'react-redux';
import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import PollForm from '../forms/PollForm/PollForm';
import {proposeLOC, updateLOC, removeLOC} from '../../redux/ducks/locs/data';
import globalStyles from '../../styles';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import BigNumber from 'bignumber.js';

const mapStateToProps = state => {
    const initialFormValues = state.get("loc").toJS();
    return ({
        initialFormValues
    })
};
@connect(mapStateToProps)
class PollModal extends Component {

    handleSubmit = (values) => {
        let account = localStorage.getItem('chronoBankAccount');
        let address = values.get('address');
        let jsValues = values.toJS();
        jsValues = {...jsValues, expDate: new BigNumber(jsValues.expDate.getTime()), issueLimit: new BigNumber(jsValues.issueLimit)}
        if (!address) {
            proposeLOC({...jsValues, account});
        } else {
            let changedProps = {};
            const x = this.props.initialFormValues;
            for(let key in jsValues) {
                if (jsValues.hasOwnProperty(key) && +jsValues[key] !== +x[key] && jsValues[key] !== x[key]){
                    changedProps[key] = jsValues[key];
                }
            }
            updateLOC({...changedProps, account, address});
        }
        this.props.hideModal();
    };

    handleSubmitClick = () => {
        this.refs.PollForm.getWrappedInstance().submit();
    };

    handleDeleteClick = () => {
        let address = this.refs.PollForm.getWrappedInstance().values.get('address');
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
                label="Delete Poll"
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
                label={locKey?"Save changes":"Create Poll"}
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
                    New Poll
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
                <PollForm ref="PollForm" onSubmit={this.handleSubmit} />
            </Dialog>
        );
    }
}

export default PollModal;