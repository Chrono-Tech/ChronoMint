import React from 'react'
import PropTypes from 'prop-types'
import { ChartCanvas, Chart, series, scale, axes } from "react-stockcharts"

import { format } from "d3-format"

export class RateHistoryChart extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.height,
  }

  render() {

    // let gridHeight = this.props.height - 30
    let gridWidth = this.props.width

    let yGrid = {
      innerTickSize: -1 * gridWidth,
      tickStrokeDasharray: 'Solid',
      tickStrokeOpacity: 0.2,
      tickStrokeWidth: 1,
      strokeOpacity: 0.2,
      tickStroke: 'rgba(0, 0, 0, 0.3)',
      opacity: 0.2,
    }

    let xGrid = {
      // innerTickSize: -1 * gridHeight,
      tickStrokeDasharray: 'Solid',
      tickStrokeOpacity: 0.2,
      tickStrokeWidth: 1,
      strokeOpacity: 0.2,
      tickStroke: 'rgba(0, 0, 0, 0.3)',
      opacity: 0.2,
    }

    let to = new Date()
    let from = new Date()
    from.setDate(to.getDate() - 365)

    let last = {
      date: new Date(from.getTime()),
      time: 0,
      lht: 0,
      lhus: 0
    }

    let data = [
      last
    ]

    from.setTime(from.getTime() + 86400000)

    let cursor = new Date()
    cursor.setTime(from.getTime())

    for (let d = cursor; d <= to; d.setTime(d.getTime() + 86400000)) {
      let l = {
        date: new Date(d.getTime()),
        time: last.time + 0.1 * (Math.random() - 0.5),
        lht: last.lht + 0.1 * (Math.random() - 0.5),
        lhus: last.lhus + 0.1 * (Math.random() - 0.5)
      }
      data.push(l)
      last = l
    }

    // TODO Move colors to palette when will connect markup to the app

    return (
      <ChartCanvas
        height={this.props.height}
        width={this.props.width}
        margin={{ left: 0, right: 0, top: 0, bottom: 30 }}
        type="svg"
        data={data}
        xAccessor={d => d.date}
        xScaleProvider={scale.discontinuousTimeScaleProvider}
        xExtents={[from, to]}
      >
        <Chart id={1}
          yExtents={d => [d.time, d.lht, d.lhus]}
        >
          <axes.XAxis axisAt="bottom" orient="bottom" {...xGrid}  />
          <axes.YAxis axisAt="right" orient="left" {...yGrid} tickFormat={format(".0%")} />

          <series.LineSeries
            yAccessor={d => d.time}
            stroke="#FFFFFF" />
          <series.LineSeries
            yAccessor={d => d.lht}
            stroke="#0039CB" />
          <series.LineSeries
            yAccessor={d => d.lhus}
            stroke="#50A0F9" />
        </Chart>

      </ChartCanvas>
    )
  }
}

export default RateHistoryChart
