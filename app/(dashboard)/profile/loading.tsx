import { AiOutlineLoading } from 'react-icons/ai'

export default function Loading() {
  return (
    <div className="absolute flex size-full items-center justify-center">
      <AiOutlineLoading className="text-secundary animate-spin" size={100} />
    </div>
  )
}
