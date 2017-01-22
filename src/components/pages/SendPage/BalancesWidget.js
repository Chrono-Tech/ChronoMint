import React, {Component} from 'react';
import {Paper, MenuItem} from 'material-ui';

class BalancesWidget extends Component {
    render() {
        return (
            <Paper style={style} zDepth={1} rounded={false}>
                <SelectField
                    floatingLabelText="Account"
                    value={this.state.value}
                    onChange={this.handleChange}>

                    <MenuItem value={1} primaryText="USD" />
                    <MenuItem value={2} primaryText="EUR" />
                    <MenuItem value={3} primaryText="AUD" />
                </SelectField>
            </Paper>
        );
    }
}

export default BalancesWidget;