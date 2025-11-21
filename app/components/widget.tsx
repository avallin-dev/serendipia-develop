import { useCallback, useEffect, useRef, useState } from 'react'

import { useAuth } from '@/app/hooks/useAuth'
import { useAdd } from '@/app/services/mutations/bot'
import { useGetMessages } from '@/app/services/queries/bot'

interface Message {
  text: string
  sender: 'user' | 'bot'
}

function Widget() {
  const { user } = useAuth()
  const id = user?.idSocio
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const { messages: backendMessages, isLoading, isFetching } = useGetMessages(id)
  const addMutation = useAdd()
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const [waitingBot, setWaitingBot] = useState(false)

  console.log(backendMessages)
  // setLocalMessages(
  //           backendMessages.map((m: { content: string; role: 'user' | 'bot' }) => ({
  //             text: m.content,
  //             sender: m.role,
  //           }))
  //         )
  // useEffect(() => {
  //   if (open && backendMessages && Array.isArray(backendMessages)) {
  //     setLocalMessages(
  //       backendMessages.map((m: { content: string; role: 'user' | 'bot' }) => ({
  //         text: m.content,
  //         sender: m.role,
  //       }))
  //     )
  //   }
  // }, [open, backendMessages])

  // useEffect(() => {
  //   if (open && chatBoxRef.current) {
  //     chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
  //   }
  // }, [localMessages, open])

  const toggleWidget = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || !id) return
    setLocalMessages((prev) => [...prev, { text: trimmed, sender: 'user' }])
    setInput('')
    setWaitingBot(true)
    try {
      const botResponse = await addMutation.mutateAsync({ socioId: id, content: trimmed })
      setLocalMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }])
    } catch (err) {
      setLocalMessages((prev) => [
        ...prev,
        { text: 'Ocurrió un error al enviar el mensaje.', sender: 'bot' },
      ])
    } finally {
      setWaitingBot(false)
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <>
      <button
        className="fixed bottom-4 right-4 z-50 m-0 inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-black bg-none p-0 text-sm font-medium normal-case leading-5 hover:bg-gray-700 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-50"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="chatbot-widget"
        data-state={open ? 'open' : 'closed'}
        onClick={toggleWidget}
        title={open ? 'Cerrar chat' : 'Abrir chat'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="block border-gray-200 align-middle text-white"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" className="border-gray-200"></path>
        </svg>
      </button>

      {open && (
        <div
          id="chatbot-widget"
          role="dialog"
          aria-modal="true"
          aria-label="Chatbot"
          style={{ boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
          className="animate-fade-in fixed bottom-[calc(4rem+1.5rem)] right-0 z-50 mr-4 flex h-[634px] max-h-[80%] w-[440px] flex-col rounded-lg border border-[#e5e7eb] bg-white p-0"
        >
          <div className="flex flex-col space-y-1.5 p-6 pb-4">
            <h2 className="text-lg font-semibold tracking-tight">Serendipia Chatbot</h2>
          </div>

          <div ref={chatBoxRef} className="flex-1 overflow-y-auto px-6" style={{ minHeight: 0 }}>
            {isLoading || isFetching ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                Cargando...
              </div>
            ) : localMessages.length === 0 ? (
              <div className="mb-2 text-left">
                <p className="inline-block rounded-lg bg-gray-200 px-4 py-2 text-gray-700">
                  ¡Hola! ¿En qué puedo ayudarte hoy?
                </p>
              </div>
            ) : (
              localMessages.map((msg, i) => (
                <div
                  key={i}
                  className={msg.sender === 'user' ? 'mb-2 text-right' : 'mb-2 text-left'}
                >
                  <p
                    className={
                      msg.sender === 'user'
                        ? 'inline-block rounded-lg bg-blue-500 px-4 py-2 text-white'
                        : 'inline-block rounded-lg bg-gray-200 px-4 py-2 text-gray-700'
                    }
                  >
                    {msg.text}
                  </p>
                </div>
              ))
            )}
            {waitingBot && (
              <div className="mb-2 text-left">
                <p className="inline-block animate-pulse rounded-lg bg-gray-200 px-4 py-2 text-gray-700">
                  El asistente está escribiendo...
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center border-t bg-white p-6">
            <form
              className="flex w-full items-center justify-center space-x-2"
              onSubmit={handleSend}
            >
              <input
                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm text-[#030712] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Escribe tu mensaje"
                value={input}
                onChange={handleInputChange}
                onKeyUp={handleKeyUp}
                disabled={waitingBot}
              />
              <button
                className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-[#f9fafb] hover:bg-[#111827E6] disabled:pointer-events-none disabled:opacity-50"
                type="submit"
                disabled={!input.trim() || waitingBot}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Widget
