import React, { Component, PropTypes } from 'react';

const propTypes = {
};

class Dashboard extends Component {
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
<AppBar title="ChronoMint" onLeftIconButtonTouchTap={this.handleToggle} style={{ margin: 0 }} />
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

        </div>
</div>
      </MuiThemeProvider>
    );
  }
}

Dashboard.propTypes = propTypes;
export default Dashboard;
