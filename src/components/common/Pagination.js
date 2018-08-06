/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import ReactPaginate from 'react-paginate'
import createFragment from 'react-addons-create-fragment'
import Button from './ui/Button/Button'

const styles = {
  btn: {
    width: '55px',
    minWidth: '55px',
  },
  selected: {
    backgroundColor: '#e2e2e2',
  },
}

class Pagination extends ReactPaginate {
  // TODO fix eslint when Pagination will be implemented
  // eslint-disable-next-line
  pageView = (index) => {
    return (<Button
      flat
      onClick={this.handlePageSelected.bind(null, index)}
      label={index + 1}
    />)
  }

  pagination = () => {
    const items = {}

    if (this.props.pageCount <= this.props.pageRangeDisplayed) {
      for (let index = 0; index < this.props.pageCount; index++) {
        items[`key${index}`] = this.pageView(index)
      }
    } else {
      let leftSide = (this.props.pageRangeDisplayed / 2)
      let rightSide = (this.props.pageRangeDisplayed - leftSide)

      if (this.state.selected > this.props.pageCount - (this.props.pageRangeDisplayed / 2)) {
        rightSide = this.props.pageCount - this.state.selected
        leftSide = this.props.pageRangeDisplayed - rightSide
      } else if (this.state.selected < this.props.pageRangeDisplayed / 2) {
        leftSide = this.state.selected
        rightSide = this.props.pageRangeDisplayed - leftSide
      }

      let index
      let page
      let breakView

      for (index = 0; index < this.props.pageCount; index++) {
        page = index + 1

        const pageView = this.pageView(index)

        if (page <= this.props.marginPagesDisplayed) {
          items[`key${index}`] = pageView
          continue
        }

        if (page > this.props.pageCount - this.props.marginPagesDisplayed) {
          items[`key${index}`] = pageView
          continue
        }

        if ((index >= this.state.selected - leftSide) && (index <= this.state.selected + rightSide)) {
          items[`key${index}`] = pageView
          continue
        }

        const keys = Object.keys(items)
        const breakLabelKey = keys[keys.length - 1]
        const breakLabelValue = items[breakLabelKey]

        // noinspection JSUnusedAssignment
        if (this.props.breakLabel && breakLabelValue !== breakView) {
          breakView = (
            <Button flat disabled label='...' style={styles.btn} />
          )

          items[`key${index}`] = breakView
        }
      }
    }
    return items
  }

  render () {
    return (
      <p style={{ textAlign: 'center' }}>
        <Button
          flat
          onClick={this.handlePreviousPage}
          label={this.props.previousLabel}
          disabled={this.state.selected === 0}
        />

        {createFragment(this.pagination())}

        <Button
          flat
          onClick={this.handleNextPage}
          label={this.props.nextLabel}
          disabled={this.state.selected === this.props.pageCount - 1}
        />
      </p>
    )
  }
}

// noinspection JSUnusedGlobalSymbols
export default Pagination
