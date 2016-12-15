import React, { Component } from 'react'
import TestForm from 'forms/TestForm'
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper'
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MenuItem from 'material-ui/MenuItem'
import { Tabs, Tab, Drawer, AppBar, IconButton } from 'material-ui'
const {Grid, Row, Col} = require('react-flexbox-grid');
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import ChronoMint from 'contracts/ChronoMint.sol';
import Web3 from 'web3';

const styles = {
  container: {
    textAlign: 'center',
  },
  appBar: {
     flexWrap: 'wrap',
   },
  tabs: {
     width: '100%',
   }
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: '#9C27B0',
    textColor: '#00BCD4',
    primary1Color: '#311B92'
  },
});

const provider = new Web3.providers.HttpProvider('http://localhost:8545')
ChronoMint.setProvider(provider);

class LOCContainer extends Component {
  constructor(props) {
    super(props)

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleToggle = this.handleToggle.bind(this);

    this.state = {
      open: false,
      open2: false,
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

handleToggle() {
    this.setState({open2: !this.state.open2});
    console.log("open")
   }

handleClose() { this.setState2({open: false}); }

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
<div>
<div>
<AppBar title="ChronoMint" onLeftIconButtonTouchTap={this.handleToggle} style={{ margin: 0 }} 
style={styles.appBar}
     iconClassNameRight="muidocs-icon-navigation-expand-more"
   >
     <Tabs style={styles.tabs}>
       <Tab label="LOC" />
       <Tab label="TIME" />
       <Tab label="WALLET" />
     </Tabs>
</AppBar>
                <Drawer
                  docked={true}
                  open={this.state.open2}
                  onRequestChange={(open) => this.setState({open})}
                  >
                  <AppBar title="AppBar" onTitleTouchTap={this.handleToggle} showMenuIconButton={false} />
                  <MenuItem onTouchTap={this.handleClose.bind(this)}>Menu Item 1</MenuItem>
                  <MenuItem onTouchTap={this.handleClose.bind(this)}>Menu Item 2</MenuItem>
                  <MenuItem onTouchTap={this.handleClose.bind(this)}>Menu Item 3</MenuItem>
                </Drawer>


                </div>
        <div style={styles.container}>
          <Dialog
            open={this.state.open}
            title="Super Secret Password"
            actions={standardActions}
            onRequestClose={this.handleRequestClose}
          >
            1-2-3-4-5
          </Dialog>
<Grid>
        <Row style={{paddingTop: "10px"}}>
          <Col xsOffset={1} xs={10} sm={6} md={4} lg={4}>
<Paper zDepth={0} style={{borderRadius: "10px"}}>
  <Toolbar>
	<ToolbarTitle text="LOC Manager" />
  </Toolbar>
          <TestForm />
</Paper>
</Col>
        </Row>
      </Grid>
          <RaisedButton
            label="My First Action"
            secondary={true}
            onTouchTap={this.handleTouchTap}
          />
        </div>
</div>
      </MuiThemeProvider>
    );
  }

}

export default LOCContainer
