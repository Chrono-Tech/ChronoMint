import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'

import './DoughnutChart.scss'

let COUNTER = 0 // Need to have unique chart id to append styles

export default class DoughnutChart extends React.Component {
  static propTypes = {
    weight: PropTypes.number,
    rounded: PropTypes.bool,
    items: PropTypes.array,
  }

  static defaultProps = {
    weight: 0.05,
    rounded: true,
    items: [
      { value: 20, fill: 'lightblue' },
      { value: 40, fillFrom: 'red', fillTo: 'blue' },
      { value: 120, fillFrom: 'green', fillTo: 'yellow' },
      { value: 70, fill: 'transparent' },
    ],
  }

  componentDidMount() {
    this.redraw()
  }

  componentDidUpdate() {
    // eslint-disable-next-line
    const root = ReactDOM.findDOMNode(this)
    root.innerHTML = ''
    this.redraw()
  }

  redraw() {
    COUNTER++

    const total = this.props.items.reduce((total, item) => total + item.value, 0)

    if (total === 0) {
      return
    }

    // eslint-disable-next-line
    const root = ReactDOM.findDOMNode(this)

    const width = 100
    const height = 100
    const outerRadius = Math.min(width, height) / 2
    const innerRadius = outerRadius * (1 - this.props.weight)
    // const fontSize = (Math.min(width,height) / 4)

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(this.props.rounded ? outerRadius - innerRadius : 0)
      .startAngle(0)

    const svg = d3.select(root).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${Math.min(width, height)}, ${Math.min(width, height)}`)
      .attr('preserveAspectRatio', 'xMinYMin')
      .append('g')
      .attr('transform', `translate(${Math.min(width, height) / 2}, ${Math.min(width, height) / 2})`)

    const defs = svg.append('svg:defs')

    const parts = []
    let position = 0
    for (const {
      value, fill, fillFrom, fillTo,
    } of this.props.items) {
      parts.push({
        value, fill, fillFrom, fillTo, position,
      })
      position += value
    }

    const sections = []
    let index = 0
    for (const {
      value, fill, fillFrom, fillTo, position,
    } of parts.reverse()) {
      const f = (fillFrom && fillTo)
        ? buildGradient(index, defs, fillFrom, fillTo, position / total)
        : fill

      const path = svg.append('path')
        .datum({ endAngle: 0 })
        .style('fill', f)
        .attr('d', arc)

      sections.push({
        path,
        value,
      })

      index++
    }

    let cursor = total
    for (const { value, path } of sections) {
      path.transition()
        .duration(750)
        .call(arcTween, 2 * Math.PI * cursor / total)
      cursor -= value
    }

    function buildGradient(index, defs, fillFrom, fillTo, offset) {
      const id = `gradient-${COUNTER}-${index}`

      const gradient = defs.append('svg:linearGradient')
        .attr('id', id)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad')

      gradient.append('svg:stop')
        .attr('offset', `${offset * 100}%`)
        .attr('stop-color', fillFrom)
        .attr('stop-opacity', 1)

      gradient.append('svg:stop')
        .attr('offset', '100%')
        .attr('stop-color', fillTo)
        .attr('stop-opacity', 1)

      return `url(#${id})`
    }

    function arcTween(transition, newAngle) {
      transition.attrTween('d', d => {
        const interpolate = d3.interpolate(d.endAngle, newAngle)
        return function (t) {
          d.endAngle = interpolate(t)
          return arc(d)
        }
      })
    }
  }

  render() {
    return (
      <div styleName='root' />
    )
  }
}
