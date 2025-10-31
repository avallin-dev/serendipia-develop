'use client'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || ''
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || ''

const usePusher = <T>(channelName: string, eventName: string): { data: T | null } => {
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    })
    const channel = pusher.subscribe(channelName)
    const handleEvent = (data: T) => {
      setData(data)
    }
    channel.bind(eventName, handleEvent)

    return () => {
      if (pusher.connection.state === 'connected') pusher.disconnect()
      channel.unbind(eventName, handleEvent)
      pusher.unsubscribe(channelName)
    }
  }, [channelName, eventName])

  return { data }
}

export default usePusher
