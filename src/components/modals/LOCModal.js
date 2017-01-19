import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import LOCForm from '../forms/LOCForm';
import {grey700} from 'material-ui/styles/colors';

const styles = {
    cancel: {
        color: grey700,
        marginRight: 10
    }
};

class LOCModal extends Component {
    constructor() {
        super();
    }

    handleSubmit = () => {
        //this.props.callback(null, this.state.value);
        this.props.hideModal();
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
                primary={true}
                onTouchTap={this.handleSubmit}
            />,
        ];

        return (
            <Dialog
                title={title || "LOC Form"}
                actions={actions}
                modal={true}
                open={open}>

                <LOCForm />
            </Dialog>
        );
    }
}

export default LOCModal;