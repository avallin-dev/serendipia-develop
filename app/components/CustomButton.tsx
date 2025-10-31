import { MouseEvent, FC } from 'react'
import { IconType } from 'react-icons'
import { AiOutlineLoading } from 'react-icons/ai'

import { Button as UIButton } from './ui/button'

interface CustomBottonProps {
  label: string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  isLoading?: boolean
  outiline?: boolean
  small?: boolean
  icon?: IconType
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
}

const CustomButton: FC<CustomBottonProps> = ({ label, onClick, disabled, isLoading, variant }) => {
  return (
    <UIButton variant={variant} disabled={disabled} onClick={onClick}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <AiOutlineLoading className="animate-spin text-2xl text-white" /> {label}
        </span>
      ) : (
        label
      )}
    </UIButton>
  )
}

export default CustomButton
