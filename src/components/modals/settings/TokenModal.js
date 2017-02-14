import React, {Component} from 'react';
import {connect} from 'react-redux';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import TokenForm from '../../../components/forms/settings/TokenForm';

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

@connect(mapStateToProps, mapDispatchToProps)
class TokenModal extends Component {
    handleSubmit = (values) => {
        values;
        this.handleClose();
    };

    handleSubmitClick = () => {
        this.refs.TokenForm.getWrappedInstance().submit();
    };

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open} = this.props;
        const actions = [
            <FlatButton
                label="Cancel"
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label={'Add Token'}
                primary={true}
                onTouchTap={this.handleSubmitClick.bind(this)}
            />,
        ];

        return (
            <Dialog
                title={<div>
                    Add Token
                    <IconButton style={{float: 'right', margin: "-12px -12px 0px"}} onTouchTap={this.handleClose}>
                        <NavigationClose />
                    </IconButton>
                </div>}
                actions={actions}
                actionsContainerStyle={{padding: 26}}
                titleStyle={{paddingBottom: 10}}
                modal={true}
                open={open}>

                <TokenForm ref="TokenForm" onSubmit={this.handleSubmit}/>

            </Dialog>
        );
    }
}

export default TokenModal;