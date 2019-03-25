import React, { Component } from 'react'
import classnames from 'classnames'

/**
  Props:
    - count: total number of pages
    - selected: currently selected page
    - onPagePrev(nextPage): callback when previous button clicked
    - onPageNext(prevPage): callback when next button clicked
    - onPage(page): callback when specific page button clicked
*/
class Pagination extends Component {
  constructor(props) {
    super(props)
  }

  // Returns the total number of pages given
  // the number of items and items per page
  static getPageCount(itemCount, itemsPerPage) {
    let count = Math.floor(itemCount / itemsPerPage)
    const left = itemCount % itemsPerPage

    // add extra page for remaining items
    if (left > 0) {
      count++
    }

    // there should always be at least one page of results
    if (count === 0) {
      count = 1
    }

    return count
  }

  // Returns the list of items that should be rendered
  // for a given page given the original list, the
  // number of items per page and the current page
  static getItemsOnPage(data, itemsPerPage, currentPage) {
    return data.filter((item, index) => {
      // only render items within the current page
      const page = currentPage - 1
      const minIndex = itemsPerPage * page
      const maxIndex = itemsPerPage * (page + 1)
      return index >= minIndex && index < maxIndex
    })
  }

  renderPageNumbers() {
    const { count, selected, onPage, viewport } = this.props
    let numbers = []
    let leftNums = []
    let rightNums = []

    //Construct all but current page
    for (let i = 1; i <= viewport; i++) {
      //Handle left of center
      if ((selected - i) >= 1) {
        leftNums.push (
          this.buildPageNum(selected - i, selected, onPage)
        )
      }

      //Handle right of center
      if ((selected + i) <= count) {
        rightNums.push (
          this.buildPageNum(selected + i, selected, onPage)
        )
      }
    }

    //Begin construction of final array to be returned

    //Reverse left numbers due to the nature in which they were added
    let newLeftNums = leftNums.reverse()
    //Add current page to left array
    newLeftNums.push(this.buildPageNum(selected, selected, onPage))

    //Concat two arrays for final list of numbers
    numbers = newLeftNums.concat(rightNums)

    return numbers
  }

  buildPageNum(pageNum, selected, onPage) {
    const pageClass = classnames({
      active: selected === pageNum,
      'page-item': true,
      'waves-effect': true,
    })

    return (
      /*
        Key is pageNum - 1 so that key is reflective on the index at which the
        page number resides within the page numbers array
      */
      <li className={pageClass} key={pageNum - 1} onClick={() => onPage(pageNum)}>
        <a className="page-link"> {pageNum} </a>
      </li>
    )
  }

  getPrevOnClick() {
    const { selected } = this.props

    // Ignore previous click when on first page
    if (selected === 1) {
      return () => {}
    }

    return this.props.onPagePrev
  }

  getNextOnClick() {
    const { selected, count } = this.props

    // Ignore next click when on last page
    if (selected === count) {
      return () => {}
    }

    return this.props.onPageNext
  }

  render() {
    const { selected, count } = this.props

    let paginationClassName = 'pagination'
    if (this.props.align) {
      paginationClassName += ' justify-content-'
      if (this.props.align == 'center') {
        paginationClassName += 'center'
      }
      if (this.props.align == 'right') {
        paginationClassName += 'end'
      }
    }

    //Forward and back buttons (Single increment and decrement)
    const prevClassName = classnames({
      'page-item': true,
      'waves-effect': true,
      hide: selected === 1,
      disabled: selected === 1,
    })
    const nextClassName = classnames({
      'page-item': true,
      'waves-effect': true,
      hide: selected === count,
      disabled: selected === count,
    })

    //First and last page buttons
    const firstClassName = classnames({
      'page-item': true,
      'pagination-first': true,
      'waves-effect': true,
      disabled: selected === 1,
    })
    const lastClassName= classnames({
      'page-item': true,
      'pagination-last': true,
      'waves-effect': true,
      disabled: selected === count,
    })

    const onPrevClick = this.getPrevOnClick()
    const onNextClick = this.getNextOnClick()

    return (
      <ul className={paginationClassName}>
        <li className={firstClassName} key="first" onClick={() => onPrevClick(1)} aria-label="Previous">
          <a className="page-link" />
        </li>
        <li className={prevClassName} key="prev" onClick={() => onPrevClick(selected - 1)} aria-label="Previous">
          <a className="page-link">...</a>
        </li>

        {this.renderPageNumbers()}

        <li className={nextClassName} key="next" onClick={() => onNextClick(selected + 1)} aria-label="Next">
          <a className="page-link">...</a>
        </li>
        <li className={lastClassName} key="last" onClick={() => onNextClick(this.props.count)} aria-label="Next">
          <a className="page-link" />
        </li>
      </ul>
    )
  }
}

export default Pagination
