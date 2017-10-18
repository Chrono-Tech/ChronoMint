import { ChartCanvas, Chart, series, scale, axes } from 'react-stockcharts'
import PropTypes from 'prop-types'
import React from 'react'
import { format } from 'd3-format'

export class RateHistoryChart extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
  }

  render () {
    // let gridHeight = this.props.height - 30
    const gridWidth = this.props.width

    const yGrid = {
      innerTickSize: -1 * gridWidth,
      tickStrokeDasharray: 'Solid',
      tickStrokeOpacity: 0.2,
      tickStrokeWidth: 1,
      strokeOpacity: 0.2,
      tickStroke: 'rgba(0, 0, 0, 0.3)',
      opacity: 0.2,
    }

    const xGrid = {
      // innerTickSize: -1 * gridHeight,
      tickStrokeDasharray: 'Solid',
      tickStrokeOpacity: 0.2,
      tickStrokeWidth: 1,
      strokeOpacity: 0.2,
      tickStroke: 'rgba(0, 0, 0, 0.3)',
      opacity: 0.2,
    }

    const to = new Date()
    const from = new Date()
    from.setDate(to.getDate() - 365)

    let last = {
      date: new Date(from.getTime()),
      time: 0,
      lht: 0,
      lhus: 0,
    }

    const data = [
      last,
    ]

    from.setTime(from.getTime() + 86400000)

    const cursor = new Date()
    cursor.setTime(from.getTime())

    for (let d = cursor; d <= to; d.setTime(d.getTime() + 86400000)) {
      const l = {
        date: new Date(d.getTime()),
        time: last.time + 0.1 * (Math.random() - 0.5),
        lht: last.lht + 0.1 * (Math.random() - 0.5),
        lhus: last.lhus + 0.1 * (Math.random() - 0.5),
      }
      data.push(l)
      last = l
    }

    // TODO @ipavlenko: Move colors to palette when will connect markup to the app

    return (
      <ChartCanvas
        height={this.props.height}
        width={this.props.width}
        margin={{
          left: 0, right: 0, top: 0, bottom: 30,
        }}
        type='svg'
        data={data}
        xAccessor={d => d.date}
        xScaleProvider={scale.discontinuousTimeScaleProvider}
        xExtents={[from, to]}
      >
        <Chart
          id={1}
          yExtents={d => [d.time, d.lht, d.lhus]}
        >
          <axes.XAxis axisAt='bottom' orient='bottom' {...xGrid} />
          <axes.YAxis axisAt='right' orient='left' {...yGrid} tickFormat={format('.0%')} />

          <series.LineSeries
            yAccessor={d => d.time}
            stroke='#FFFFFF'
          />
          <series.LineSeries
            yAccessor={d => d.lht}
            stroke='#0039CB'
          />
          <series.LineSeries
            yAccessor={d => d.lhus}
            stroke='#50A0F9'
          />
        </Chart>

      </ChartCanvas>
    )
  }
}

export default RateHistoryChart

