import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Divider } from 'material-ui'
import { Table, TableHeader, TableBody, TableHeaderColumn, TableRowColumn, TableRow } from 'material-ui/Table'
import { listStory } from '../redux/lhStory/lhStory'
import styles from '../styles'

const customStyles = {
  columns: {
    name: {
      width: '15%'
    },
    address: {
      width: '55%'
    }
  }
}

const mapStateToProps = (state) => ({
  list: state.get('lhStory').list
})

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listStory())
})

@connect(mapStateToProps, mapDispatchToProps)
class LHStoryPage extends Component {
  componentDidMount () {
    this.props.getList()
  }

  render () {
    return (
      <div>
        <span style={styles.navigation}>ChronoMint / LH story</span>

        <Paper style={styles.paper}>
          <h3 style={styles.title}>LH Operations Story</h3>
          <Divider />

          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={customStyles.columns.name}>One</TableHeaderColumn>
                <TableHeaderColumn style={customStyles.columns.address}>Two</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.props.list.entrySeq().map(([index, item]) =>
                <TableRow key={index}>
                  <TableRowColumn style={customStyles.columns.name}>{index}</TableRowColumn>
                  <TableRowColumn style={customStyles.columns.address}>{item}</TableRowColumn>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

export default LHStoryPage
