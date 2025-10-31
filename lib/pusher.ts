import Pusher from 'pusher-js'

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || ''
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || ''

const pusher = new Pusher(PUSHER_KEY, {
  cluster: PUSHER_CLUSTER,
})

export default pusher
