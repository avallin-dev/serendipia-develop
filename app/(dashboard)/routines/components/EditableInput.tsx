'use client'

import { Pencil2Icon, CheckIcon } from '@radix-ui/react-icons'
import { Fragment, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { submitUpdateComment } from '@/app/actions/routine'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type EditableInputProps = {
  value?: string
  className?: string
  routineId: number
  week: number
}

export default function EditableInput({ className, value, routineId, week }: EditableInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [inputVisible, setInputVisible] = useState(false)
  useEffect(() => {
    if (value) {
      setInputValue(value)
    } else {
      setInputValue('')
    }
  }, [value])

  const inputRef = useRef(null)
  useOutsideClick(inputRef)

  function useOutsideClick(ref: React.RefObject<HTMLDivElement>) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent | TouchEvent) {
        if (inputVisible && ref.current && !ref.current.contains(event.target as Node)) {
          setInputVisible(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    })
  }

  const handleSubmit = async () => {
    try {
      await submitUpdateComment({ comment: inputValue, routineId, week })
      toast.success('Comentario actualizado exitosamente')
      setInputVisible(false)
    } catch (error) {
      toast.error('Error inesperado. Intente más tarde')
    }
  }

  return (
    <Fragment>
      {inputVisible ? (
        <div ref={inputRef} className="relative flex-grow cursor-pointer">
          <Input
            value={inputValue}
            autoFocus
            onChange={(e) => setInputValue(e.target.value)}
            className="text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
          />
          <Button
            variant="ghost"
            className="absolute right-0 top-1 aspect-square h-7 w-7 rounded-full px-1 transition-transform hover:scale-125"
            onClick={handleSubmit}
          >
            <CheckIcon width={20} height={20} color="green" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => setInputVisible(true)}
          className={cn('relative flex h-5 cursor-pointer items-center justify-between', className)}
        >
          {inputValue ? (
            <div className="text-xs text-white">{inputValue}</div>
          ) : (
            <div className="text-xs text-muted text-white">Añade un comentario</div>
          )}
          <Pencil2Icon className="size-4 text-white opacity-70" />
        </div>
      )}
    </Fragment>
  )
}
