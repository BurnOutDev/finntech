import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFinnhubSocket } from './hooks/useFinnhubSocket'
import Stock from './Stock'
import { selectStock, trade } from './redux/stockSlice'
import { symbols } from './constants'
import styled from 'styled-components'

const Container = styled.div`
  text-align: center;
`

const StockContainer = styled.div`
  height: 90vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Header = styled.p`
  font-size: 24px;
  margin: 16px 0 0 0;
`

const Subtitle = styled.p`
  font-size: 16px;
  margin: 0;
`

const App = () => {
  const dispatch = useDispatch()

  const swedishKroneStocks = useSelector(selectStock(symbols.sekUsd))
  const btcUsdtStocks = useSelector(selectStock(symbols.btcUsdt))
  const [isError, setIsError] = useState(false)

  const isDataLoaded = swedishKroneStocks.length > 0 && btcUsdtStocks.length > 0

  const messageHandler = (message) => {
    const { data, type } = JSON.parse(message.data)

    if (type !== 'trade') return

    const payload = data.map((entry) => ({
      price: entry.p,
      time: entry.t,
      symbol: entry.s
    }))

    dispatch(trade(payload))
  }

  const [connect] = useFinnhubSocket({
    symbols: [symbols.btcUsdt, symbols.sekUsd],
    onMessage: messageHandler,
    onError: () => setIsError(true)
  })

  useEffect(() => {
    connect()
  }, [])

  return (
    <Container>
      <Header>Finntech Real-Time Data</Header>

      <Subtitle hidden={!isDataLoaded}>
        Here you see Swedish Krone to USD and Bitcoin to USD fetched realtime
        using WebSocket provided by{' '}
        <a href="https://finnhub.io" target="_blank" rel="noreferrer">
          Finnhub.io
        </a>
      </Subtitle>

      <Subtitle hidden={!!isDataLoaded || isError}>
        Data is loading from provider, it won't take much time
      </Subtitle>

      <Subtitle hidden={!isError}>
        Connection error occured, because of free-tier limit, please
        retry in approximately one minute...
      </Subtitle>

      <StockContainer hidden={!isDataLoaded}>
        <Stock
          data={swedishKroneStocks}
          header="SEK/USD"
          currencySymbol="kr."
        />
        <Stock data={btcUsdtStocks} header="BTC/USDT" currencySymbol="$" />
      </StockContainer>
    </Container>
  )
}

export default App
