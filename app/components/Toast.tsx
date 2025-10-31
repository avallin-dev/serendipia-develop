import { LiaCheckCircle, LiaTimesCircle } from 'react-icons/lia'

const types = {
  error: <LiaTimesCircle className="text-error-50 text-xl" />,
  success: <LiaCheckCircle className="text-success-50 text-xl" />,
}

const Toast = ({
  title,
  content,
  type,
}: {
  title: string
  content: string
  type: 'error' | 'success'
}) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        {types[type]}
        <p className="text-gray-scale-50 text-base font-semibold">{title}</p>
      </div>
      <p className="text-gray-scale-50 text-sm">{content}</p>
    </div>
  )
}

export default Toast
