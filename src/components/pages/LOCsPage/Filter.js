import React, {Component} from 'react'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

const styles = {
  filterMenu: {
    margin: '-15px -25px'
  },
  underlineStyle: {
    borderTop: 'none'
  }
}

class Filter extends Component {
  constructor (props) {
    super(props)
    this.state = {value: 1}
  }

  handleChange = (event, index, value) => this.setState({value});

  render () {
    const {locs} = this.props
    return (
      <div>
        <span>
          {locs.size} entries
        </span>
        <span style={{float: 'right', display: 'none'}}>
          <span style={{verticalAlign: 'top'}}>Show only: </span>
          <DropDownMenu value={this.state.value} onChange={this.handleChange} style={styles.filterMenu}
            underlineStyle={styles.underlineStyle}>
            <MenuItem value={1} primaryText='LHT' />
            <MenuItem value={2} primaryText='LHEU' />
            <MenuItem value={3} primaryText='LHAU' />
          </DropDownMenu>
          <div style={{display: 'inline-block'}}>
            <span style={{verticalAlign: 'top'}}> Sorted by: </span>
            <DropDownMenu value={this.state.value} onChange={this.handleChange} style={styles.filterMenu}
              underlineStyle={styles.underlineStyle}>
              <MenuItem value={1} primaryText='Time added' />
              <MenuItem value={2} primaryText='Time added' />
              <MenuItem value={3} primaryText='Time added' />
            </DropDownMenu>
          </div>
        </span>
      </div>
    )
  }
}

export default Filter
