import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';
import createFragment from 'react-addons-create-fragment';
import {FlatButton} from 'material-ui';

const styles = {
    btn: {
        width: '55px',
        minWidth: '55px'
    },
    selected: {
        backgroundColor: '#e2e2e2'
    }
};

class Pagination extends ReactPaginate {
    pageView = (index) => {
        return <FlatButton onTouchTap={this.handlePageSelected.bind(null, index)}
                           style={Object.assign({}, styles.btn, this.state.selected === index ? styles.selected : {})}
                           label={index + 1}/>
    };

    pagination = () => {
        let items = {};

        if (this.props.pageCount <= this.props.pageRangeDisplayed) {
            for (let index = 0; index < this.props.pageCount; index++) {
                items['key' + index] = this.pageView(index);
            }

        } else {
            let leftSide = (this.props.pageRangeDisplayed / 2);
            let rightSide = (this.props.pageRangeDisplayed - leftSide);

            if (this.state.selected > this.props.pageCount - this.props.pageRangeDisplayed / 2) {
                rightSide = this.props.pageCount - this.state.selected;
                leftSide = this.props.pageRangeDisplayed - rightSide;
            }
            else if (this.state.selected < this.props.pageRangeDisplayed / 2) {
                leftSide = this.state.selected;
                rightSide = this.props.pageRangeDisplayed - leftSide;
            }

            let index;
            let page;
            let breakView;

            for (index = 0; index < this.props.pageCount; index++) {
                page = index + 1;

                let pageView = this.pageView(index);

                if (page <= this.props.marginPagesDisplayed) {
                    items['key' + index] = pageView;
                    continue;
                }

                if (page > this.props.pageCount - this.props.marginPagesDisplayed) {
                    items['key' + index] = pageView;
                    continue;
                }

                if ((index >= this.state.selected - leftSide) && (index <= this.state.selected + rightSide)) {
                    items['key' + index] = pageView;
                    continue;
                }

                let keys = Object.keys(items);
                let breakLabelKey = keys[keys.length - 1];
                let breakLabelValue = items[breakLabelKey];

                //noinspection JSUnusedAssignment
                if (this.props.breakLabel && breakLabelValue !== breakView) {
                    breakView = (
                        <FlatButton disabled={true} label={'...'} style={styles.btn}/>
                    );

                    items['key' + index] = breakView;
                }
            }
        }

        return items;
    };

    render() {
        return (
            <p style={{textAlign: 'center'}}>
                <FlatButton onTouchTap={this.handlePreviousPage}
                            label={this.props.previousLabel}
                            disabled={this.state.selected === 0}/>

                {createFragment(this.pagination())}

                <FlatButton onTouchTap={this.handleNextPage}
                            label={this.props.nextLabel}
                            disabled={this.state.selected === this.props.pageCount - 1}/>
            </p>
        );
    }
}


export default Pagination;