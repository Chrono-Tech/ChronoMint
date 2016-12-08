import React, { Component } from 'react'
import LOC from 'components/LOC/LOC'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { reduxForm, Field } from 'redux-form'
import MenuItem from 'material-ui/MenuItem'
import { RadioButton } from 'material-ui/RadioButton'
import {
  Checkbox,
  RadioButtonGroup,
  SelectField,
  TextField,
  Toggle
} from 'redux-form-material-ui'

import ChronoMint from 'contracts/ChronoMint.sol';
import Web3 from 'web3';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

const provider = new Web3.providers.HttpProvider('http://localhost:8545')
ChronoMint.setProvider(provider);

class LOCContainer extends Component {
  constructor(props) {
    super(props)

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
      open: false,
    };
  }

 handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  handleTouchTap() {
/* var chrono = ChronoMint.deployed()
      chrono.setName.call('name').then(function (value) {
        console.log(value);
        chrono.getLOC.call().then(function (value) {
               console.log(value);
      })
      }).catch(function (e) {
        console.log(e)
      })*/
    this.setState({
      open: true,
    });
  }

  componentDidMount() {
  }

render() {
    const standardActions = (
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleRequestClose}
      />
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Dialog
            open={this.state.open}
            title="Super Secret Password"
            actions={standardActions}
            onRequestClose={this.handleRequestClose}
          >
            1-2-3-4-5
          </Dialog>
          <h1>ChronoMint</h1>
          <h2>Chronobank Manager</h2>
      <form>
        <Field name="username" component={TextField} hintText="Street"/>

        <Field name="plan" component={SelectField} hintText="Select a plan">
          <MenuItem value="monthly" primaryText="Monthly"/>
          <MenuItem value="yearly" primaryText="Yearly"/>
          <MenuItem value="lifetime" primaryText="Lifetime"/>
        </Field>

        <Field name="agreeToTerms" component={Checkbox} label="Agree to terms?"/>

        <Field name="receiveEmails" component={Toggle} label="Please spam me!"/>

        <Field name="bestFramework" component={RadioButtonGroup}>
          <RadioButton value="react" label="React"/>
          <RadioButton value="angular" label="Angular"/>
          <RadioButton value="ember" label="Ember"/>
        </Field>
      </form>
          <RaisedButton
            label="My First Action"
            secondary={true}
            onTouchTap={this.handleTouchTap}
          />
        </div>
      </MuiThemeProvider>
    );
  }

}

// Decorate with redux-form
LOCContainer = reduxForm({
  form: 'LOCContainer'
})(LOCContainer)
export default LOCContainer
