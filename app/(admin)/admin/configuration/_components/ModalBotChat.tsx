import { useEffect, useRef } from 'react'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useGetMessages } from '@/app/services/queries/bot'

interface ModalBotChatProps {
  open: boolean
  onClose: () => void
  socioId: number | null
  nombre?: string
}

export default function ModalBotChat({ open, onClose, socioId, nombre }: ModalBotChatProps) {
  const { messages, isLoading, isFetching } = useGetMessages(socioId ?? 0)
  const chatBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages, open])

  if (!open) return null

  const bodyContent = (
    <div className="flex items-center justify-center bg-black bg-opacity-30">
      <div className="flex h-[600px] w-full max-w-lg flex-col rounded-lg bg-white">
        <div
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto bg-white px-6 py-4"
          style={{ minHeight: 0 }}
        >
          {isLoading || isFetching ? (
            <div className="flex h-full items-center justify-center text-gray-400">Cargando...</div>
          ) : messages.length === 0 ? (
            <div className="mb-2 text-left">
              <p className="inline-block rounded-lg bg-gray-200 px-4 py-2 text-gray-700">
                Este usuario aún no ha enviado mensajes.
              </p>
            </div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages.map((msg: any, i: number) => (
              <div key={i} className={msg.role === 'user' ? 'mb-2 text-right' : 'mb-2 text-left'}>
                <p
                  className={
                    msg.role === 'user'
                      ? 'inline-block rounded-lg bg-blue-500 px-4 py-2 text-white'
                      : 'inline-block rounded-lg bg-gray-200 px-4 py-2 text-gray-700'
                  }
                >
                  {msg.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title={`Chat de ${nombre || 'Socio'}`}
      body={bodyContent}
    />
  )
}
