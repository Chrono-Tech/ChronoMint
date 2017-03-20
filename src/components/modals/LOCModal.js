import {connect} from 'react-redux';
import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import LOCForm from '../forms/LOCForm/LOCForm';
import {proposeLOC, updateLOC, removeLOC} from '../../redux/ducks/locs/actions';
import globalStyles from '../../styles';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const mapStateToProps = state => {
    const initialFormValues = state.get('loc').toJS();

    return ({
        initialFormValues
    })
};

const mapDispatchToProps = (dispatch) => ({
    updateLOC: (params) => dispatch(updateLOC(params)),
    proposeLOC: (params) => dispatch(proposeLOC(params)),
    removeLOC: (address) => dispatch(removeLOC(address)),
});

@connect(mapStateToProps, mapDispatchToProps)
class LOCModal extends Component {

    handleSubmit = (values) => {
        let account = localStorage.getItem('chronoBankAccount');
        // let locAddress = values.get('address');
        let jsValues = values.toJS();
        jsValues = {...jsValues, expDate: jsValues.expDate.getTime()}
        if (!jsValues.address) {
            this.props.proposeLOC({...jsValues, account}).then( r=> {
                if (r === true) {
                    this.props.hideModal();
                }
            });
        } else {
            this.props.updateLOC({...jsValues, account}).then( r=> {
                if (r === true) {
                    this.props.hideModal();
                }
            });
        }
    };

    handleSubmitClick = () => {
        this.refs.LOCForm.getWrappedInstance().submit();
    };

    handleDeleteClick = () => {
        let address = this.refs.LOCForm.getWrappedInstance().values.get('address');
        this.props.removeLOC(address).then( r=> {
            if (r === true) {
                this.props.hideModal();
            }
        });
    };

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open, locExists, pristine, submitting} = this.props;
        const actions = [
            locExists?<FlatButton
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
                label={locExists?"Save changes":"Create LOC"}
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
                    {locExists?"Edit LOC":"New LOC"}
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