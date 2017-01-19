import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form/immutable';
import {connect} from 'react-redux';

import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import DatePicker from 'material-ui/DatePicker';

import {grey400} from 'material-ui/styles/colors';

const styles = {
    toggleDiv: {
        marginTop: 40,
    },
    toggleLabel: {
        color: grey400,
    }
};

class LOCForm extends Component {
    constructor() {
        super();
        this.state = {
            loc: {
                status: null
            }
        }
    }

    handleStatusChange = (event, index, value) => {
        this.setState({
            loc: {
                ...this.state.loc,
                status: value
            }
        });
    };

    render() {
        return (
            <form>
                <div className="row">
                    <div className="col-sm-6 col-md-6">
                        <TextField
                            floatingLabelText="Name"
                            fullWidth={true} />

                        <TextField
                            floatingLabelText="Website"
                            fullWidth={true} />

                        <SelectField
                            floatingLabelText="Status"
                            value={this.state.loc.status}
                            onChange={this.handleStatusChange}
                            fullWidth={true}>
                            <MenuItem key={0}
                                      value="Maintenance"
                                      primaryText="Maintenance"/>
                            <MenuItem key={1}
                                      value="Active"
                                      primaryText="Active"/>
                            <MenuItem key={2}
                                      value="Suspended"
                                      primaryText="Suspended"/>
                            <MenuItem key={3}
                                      value="Bankrupt"
                                      primaryText="Bankrupt"/>
                        </SelectField>
                    </div>

                    <div className="col-sm-6 col-md-6">
                        <DatePicker
                            hintText="Expiration Date"
                            floatingLabelText="Expiration Date"
                            fullWidth={true}/>

                        <div style={styles.toggleDiv}>
                            <Toggle
                                label="Disabled"
                                labelStyle={styles.toggleLabel}
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default LOCForm;