import { format } from 'date-fns'
import React from 'react'
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

const Stock = ({ header, currencySymbol, data }) => {
  const hasData = !!data?.length

  const priceFormatter = (price) => [`${price}${currencySymbol}`, 'Price']

  const labelTimeFormatter = (date) => format(new Date(date), 'hh:mm:ss a')

  return (
    hasData && (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 80, right: 80, bottom: 50, left: 50 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            domain={['auto', 'auto']}
            label={{ value: 'Time', position: 'top' }}
            tickFormatter={labelTimeFormatter}
          />
          <YAxis
            domain={['auto', 'auto']}
            label={{
              value: header,
              position: 'top',
              transform: 'translate(0 -16)',
              fontSize: 16
            }}
            unit={currencySymbol}
          />
          <Tooltip
            formatter={priceFormatter}
            labelFormatter={labelTimeFormatter}
          />
          <Area
            dataKey="price"
            dot={false}
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  )
}

export default Stock
