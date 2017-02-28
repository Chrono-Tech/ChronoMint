import {connect} from 'react-redux';
import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import IssueLHForm from '../forms/IssueLH/IssueLHForm';
import {proposeLOC, updateLOC, removeLOC} from '../../redux/ducks/locs/data';
import globalStyles from '../../styles';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import BigNumber from 'bignumber.js';

const mapStateToProps = state => {
    const loc = state.get("loc").toJS();
    return ({loc})
};
@connect(mapStateToProps)
class IssueLHModal extends Component {

    handleSubmit = (values) => {
        let account = localStorage.getItem('chronoBankAccount');
        let jsValues = values.toJS();
        let address = values.address;
        jsValues = {...jsValues, issueAmount: new BigNumber(jsValues.issueAmount)};
        let changedProps = {};
        const x = this.props.loc;
        for(let key in jsValues) {
            if (jsValues.hasOwnProperty(key) && +jsValues[key] !== +x[key] && jsValues[key] !== x[key]){
                changedProps[key] = jsValues[key];
            }
        }
        updateLOC({...changedProps, account, address});
        this.props.hideModal();
    };

    handleSubmitClick = () => {
        this.refs.IssueLHForm.getWrappedInstance().submit();
    };

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open, locKey, pristine, submitting} = this.props;
        const actions = [
            <FlatButton
                label="Cancel"
                style={globalStyles.flatButton}
                labelStyle={globalStyles.flatButtonLabel}
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label={"ISSUE LHUS"}
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
                    Issue LH
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
                <IssueLHForm ref="IssueLHForm" onSubmit={this.handleSubmit} />
            </Dialog>
        );
    }
}

export default IssueLHModal;