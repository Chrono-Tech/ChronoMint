import React, {Component} from 'react';
import {Paper, TextField, MenuItem} from 'material-ui';

const style = {
    width: '100%'
};

class SendWidget extends Component {
    render() {
        return (
            <Paper style={style} zDepth={1} rounded={false}>
                <TextField floatingLabelText="Recepient address" />
                <TextField floatingLabelText="Amount"
                           hintText="0.0" />

                <SelectField
                    floatingLabelText="Currency"
                    value={this.state.value}
                    onChange={this.handleChange}
                >
                    <MenuItem value={1} primaryText="USD" />
                    <MenuItem value={2} primaryText="EUR" />
                    <MenuItem value={3} primaryText="AUD" />
                </SelectField>
            </Paper>
        );
    }
}

export default SendWidget;