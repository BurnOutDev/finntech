import { useCallback, useEffect, useState } from 'react'

export const useFinnhubSocket = ({
  symbols = [],
  onOpen,
  onMessage,
  onClose,
  onError
}) => {
  const [socket, setSocket] = useState(null)

  const subscribeToSymbols = useCallback(() => {
    symbols.forEach((symbol) => {
      socket.send(JSON.stringify({ type: 'subscribe', symbol }))
    })
  }, [symbols, socket])

  useEffect(() => {
    if (!socket) return

    socket.addEventListener('open', onOpen)
    socket.addEventListener('open', subscribeToSymbols)

    return () => {
      socket.removeEventListener('open', onOpen)
      socket.removeEventListener('open', subscribeToSymbols)
    }
  }, [socket, subscribeToSymbols, onOpen])

  useEffect(() => {
    if (!socket) return

    socket.addEventListener('message', onMessage)

    return () => {
      socket.removeEventListener('message', onMessage)
    }
  }, [socket, onMessage])

  useEffect(() => {
    if (!socket) return

    socket.addEventListener('close', onClose)

    return () => {
      socket.removeEventListener('close', onClose)
    }
  }, [socket, onClose])

  const connect = useCallback(() => {
    const uri = `${process.env.REACT_APP_PROVIDER}?token=${process.env.REACT_APP_TOKEN}`
    const ws = new WebSocket(uri)
    ws.onerror = onError
    setSocket(ws)
  }, [])

  const close = useCallback(() => socket.close(), [socket])

  return [connect, close]
}
