import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: []
}

export const stockSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    trade: (state, { payload }) => {
      state.data.push(...payload)
    }
  }
})

export const { trade } = stockSlice.actions

export const selectStock = (symbol) => (state) =>
  state.stock.data.filter((stock) => stock.symbol === symbol)

export default stockSlice.reducer
