import React, { useState, useEffect } from 'react'
import { MdPlayArrow, MdPause, MdOutlineRestartAlt } from 'react-icons/md'

import { Button } from './ui/button'

interface TimerProps {
  numberOfSeries: number
  timePerSeries: number
  timeRest: number
}

const Timer: React.FC<TimerProps> = ({ numberOfSeries, timePerSeries, timeRest }) => {
  const [series, setSeries] = useState(numberOfSeries)
  const [time, setTime] = useState(timePerSeries * 1000)
  const [isRunning, setIsRunning] = useState(false)
  const [isResting, setIsResting] = useState(false)
  const [sequence, setSequence] = useState(0)
  const [timeRef, setTimeRef] = useState(Date.now())

  const restTime = timeRest * 1000
  const exercises = ['EJERCICIO', 'DESCANSO']

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
            if (isResting) {
              setIsResting(false)
              setSeries(series - 1)
              setTime(timePerSeries * 1000)
            } else {
              if (series > 1) {
                setIsResting(true)
                setTime(restTime)
              } else {
                handleNextExercise()
                setIsRunning(false)
                return 0
              }
            }
            return prevTime
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
  }, [isRunning, isResting, timeRef, time, series, timePerSeries, restTime])

  const handleStart = () => {
    if (!isRunning && series > 0) {
      setIsRunning(true)
      setIsResting(false)
      setTime(timePerSeries * 1000)
      setTimeRef(Date.now())
    }
  }

  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false)
      setIsResting(false)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setSeries(numberOfSeries)
    setIsResting(false)
    setTime(timePerSeries * 1000)
    setSequence(0)
  }

  const handleOnclick = () => {
    if (isRunning) {
      handlePause()
    } else {
      handleStart()
    }
  }

  const handleNextExercise = () => {
    if (sequence < exercises.length - 1) {
      setSequence(sequence + 1)
      setTime(timePerSeries * 1000)
    } else {
      setSeries((prevSeries) => prevSeries - 1)
      setSequence(0)
    }
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
        isRunning && isResting
          ? 'bg-red-600/20 outline-red-600'
          : isRunning
          ? 'bg-green-600/30 outline-green-600'
          : 'outline-transparent'
      }`}
    >
      <Button onClick={handleOnclick} className="h-16 w-16">
        {isRunning ? <MdPause color="black" size={34} /> : <MdPlayArrow color="black" size={34} />}
      </Button>
      <div className="flex-grow">
        <h2 className="font-medium tracking-wide text-secondary-foreground">Temporizador</h2>
        <p className="tracking-wide text-secondary-foreground">
          {isResting ? 'Descanso' : `Serie ${series} - ${exercises[sequence]}`}
        </p>
        <p className="tracking-wide text-secondary-foreground">{formatTime(time)}</p>
      </div>
      <Button onClick={handleReset} variant="ghost" className="h-12 px-2 hover:bg-white/40">
        <MdOutlineRestartAlt color="white" size={34} />
      </Button>
    </div>
  )
}

export default Timer
