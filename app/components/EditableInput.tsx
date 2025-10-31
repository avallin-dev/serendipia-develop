'use client'

import { Pencil2Icon, CheckIcon } from '@radix-ui/react-icons'
import { Fragment, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { submitEditProfile } from '@/app/actions'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

type EditableInputProps = {
  value?: string
  type: 'textarea' | 'text'
  className?: string
  partnerKey: string
  partnerId: number
}

export default function EditableInput({
  className,
  value,
  type,
  partnerKey,
  partnerId,
}: EditableInputProps) {
  const [inputValue, setInputValue] = useState(value || '')
  const [inputVisible, setInputVisible] = useState(false)
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
      await submitEditProfile({ partnerKey, data: inputValue, id: partnerId })
      toast.success('Perfil actualizado exitosamente')
      setInputVisible(false)
    } catch (error) {
      toast.error('Error inesperado. Intente mas tarde')
    }
  }

  return (
    <Fragment>
      {type === 'textarea' ? (
        inputVisible ? (
          <div className="relative h-full cursor-pointer" ref={inputRef}>
            <Textarea
              value={inputValue}
              autoFocus
              className={cn('h-full', className)}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button
              variant="ghost"
              className="absolute bottom-0 right-0 aspect-square h-10 w-10 rounded-full px-2 transition-transform hover:scale-125"
              onClick={handleSubmit}
            >
              <CheckIcon width={40} height={40} color="green" />
            </Button>
          </div>
        ) : (
          <div
            onClick={() => setInputVisible(true)}
            className={cn('relative h-full cursor-pointer', className)}
          >
            {inputValue}
            <Pencil2Icon
              width={24}
              height={24}
              color="#292D32"
              className="absolute bottom-1 right-0 opacity-90"
            />
          </div>
        )
      ) : inputVisible ? (
        <div ref={inputRef} className="relative flex-grow cursor-pointer">
          <Input value={inputValue} autoFocus onChange={(e) => setInputValue(e.target.value)} />
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
          className={cn('relative flex-grow cursor-pointer', className)}
        >
          {inputValue}
          <Pencil2Icon
            width={18}
            height={18}
            color="#292D32"
            className="absolute right-0 top-1 bg-white opacity-70"
          />
        </div>
      )}
    </Fragment>
  )
}
