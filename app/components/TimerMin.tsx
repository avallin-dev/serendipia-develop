import React, { useState, useEffect } from 'react'
import { MdPlayArrow, MdPause, MdOutlineRestartAlt } from 'react-icons/md'

import { Button } from './ui/button'

interface TimerProps {
  initialTime: number
}

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime * 1000 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [timeRef, setTimeRef] = useState(Date.now())

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        const elapsedTime = Date.now() - timeRef
        setTime((prevTime) => {
          if (prevTime > elapsedTime) {
            setTimeRef(Date.now())
            return prevTime - elapsedTime
          } else {
            setIsRunning(false)
            return 0
          }
        })
      }, 100)
    } else {
      clearInterval(interval!)
    }

    const audio = document.getElementById('stop') as HTMLMediaElement
    if (time < 3000) {
      audio?.play()
    } else audio?.pause()
    return () => clearInterval(interval!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, time])

  const handleOnclick = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setTime(initialTime * 1000 * 60)
    setIsRunning(false)
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600000)
    const minutes = Math.floor((time % 3600000) / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const milliseconds = Math.floor((time % 1000) / 100)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds}`
  }
  return (
    <div
      className={`flex items-center gap-x-2 rounded-2xl p-2 outline ${
        isRunning ? 'bg-green-600/30 outline-green-600' : 'outline-transparent'
      }`}
    >
      <Button onClick={handleOnclick} className="h-16 w-16">
        {isRunning ? <MdPause color="black" size={34} /> : <MdPlayArrow color="black" size={34} />}
      </Button>
      <div className="flex-grow">
        <h2 className="font-medium tracking-wide text-secondary-foreground">Temporizador</h2>
        <p className="tracking-wide text-secondary-foreground">{formatTime(time)}</p>
      </div>
      <Button onClick={handleReset} className="h-12 px-2 hover:bg-white/40">
        <MdOutlineRestartAlt color="white" size={34} />
      </Button>
    </div>
  )
}

export default Timer
