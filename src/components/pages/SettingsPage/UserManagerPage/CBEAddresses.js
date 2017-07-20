import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import { RaisedButton, FloatingActionButton, Paper, Divider, CircularProgress } from 'material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { Translate } from 'react-redux-i18n'
import globalStyles from 'styles'
import CBEModel from 'models/CBEModel'
import { listCBE, formCBE, revokeCBE } from 'redux/settings/user/cbe/actions'
import styles from '../styles'
import ls from '../../../../utils/LocalStorage'

const mapStateToProps = (state) => {
  state = state.get('settingsUserCBE')
  return {
    list: state.list,
    selected: state.selected,
    isFetched: state.isFetched,
    isFetching: state.isFetching,
    isRemove: state.isRemove
  }
}

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listCBE()),
  form: (cbe: CBEModel) => dispatch(formCBE(cbe)),
  revoke: (cbe: CBEModel) => dispatch(revokeCBE(cbe))
})

@connect(mapStateToProps, mapDispatchToProps)
export default class CBEAddresses extends Component {
  componentWillMount () {
    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getList()
    }
  }

  render () {
    return (
      <Paper style={globalStyles.paper}>
        <h3 style={globalStyles.title}><Translate value='settings.user.cbeAddresses.title' /></h3>
        <Divider />

        <FloatingActionButton
          style={styles.floatingActionButton}
          onTouchTap={this.props.form.bind(null, new CBEModel())}>
          <ContentAdd />
        </FloatingActionButton>

        <Table>
          <TableHeader className='xs-hide' adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.columns.name}>Name</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.address}>Address</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.action}>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody className='xs-reset-table' displayRowCheckbox={false}>
            {this.props.isFetching
              ? <TableRow>
                <TableRowColumn>
                  <CircularProgress size={24} thickness={1.5} />
                </TableRowColumn>
              </TableRow>
              : this.props.list.entrySeq().map(([address, item]) =>
                <TableRow key={address}>
                  <TableRowColumn style={styles.columns.name}>{item.name()}</TableRowColumn>
                  <TableRowColumn style={styles.columns.address}>{address}</TableRowColumn>
                  <TableRowColumn style={styles.columns.action}>
                    {item.isFetching()
                      ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}} />
                      : <div style={{padding: 4}}>
                        <RaisedButton
                          label='Remove'
                          disabled={ls.getAccount() === address}
                          style={styles.actionButton}
                          onTouchTap={this.props.revoke.bind(null, item)} />
                      </div>}
                  </TableRowColumn>
                </TableRow>
              )
            }
          </TableBody>
        </Table>

        <div style={globalStyles.clear} />
      </Paper>
    )
  }
}

CBEAddresses.propTypes = {
  isRemove: PropTypes.bool,
  isFetching: PropTypes.bool,
  isFetched: PropTypes.bool,
  getList: PropTypes.func,
  form: PropTypes.func,
  list: PropTypes.object,
  removeToggle: PropTypes.func,
  revoke: PropTypes.func,
  selected: PropTypes.object
}
