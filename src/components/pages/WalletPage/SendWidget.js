import React, {Component} from 'react';
import {
    Paper,
    TextField,
    SelectField,
    MenuItem,
    Divider,
    RaisedButton
} from 'material-ui';

import globalStyles from '../../../styles';

const styles = {
    label: {
        fontWeight: 300
    },
    value: {
        float: 'right',
        fontWeight: 500
    },
    btn: {
        marginTop: 10
    }
};

class SendWidget extends Component {
    constructor() {
        super();
        this.state = {
            currencies: ['ETH', 'LHT', 'TIME'],
            selectedCurrency: 'ETH'
        }
    }

    handleChange = (event, index, value) => {
      this.setState({selectedCurrency: value});
    };

    render() {
        const {currencies} = this.state;
        return (
            <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
                <h3 style={globalStyles.title}>Send tokens</h3>
                <Divider style={{backgroundColor: globalStyles.title.color}}/>

                <div className="row">
                    <div className="col-sm-12">
                        <TextField floatingLabelText="Recipient address" fullWidth={true} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <TextField floatingLabelText="Amount"
                                   floatingLabelFixed={true}
                                   hintText="0.0"
                                   fullWidth={true}/>
                    </div>
                    <div className="col-sm-6">
                        <SelectField
                            floatingLabelText="Currency"
                            value={this.state.selectedCurrency}
                            fullWidth={true}
                            onChange={this.handleChange}>
                            {currencies.map(c => <MenuItem key={c} value={c} primaryText={c} />)}
                        </SelectField>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div>
                            <span style={styles.label}>Fee:</span>
                            <span style={styles.value}>0.01</span>
                        </div>
                        <div>
                            <span style={styles.label}>Total:</span>
                            <span style={styles.value}>1.01</span>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <RaisedButton label="Send"
                                      style={styles.btn}
                                      primary={true}
                                      fullWidth={true}
                                      onTouchTap={this.handleClick}/>
                    </div>
                </div>
            </Paper>
        );
    }
}

export default SendWidget;