import * as React from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

import { cn } from '@/lib/utils'

import { Button } from './button'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export interface InputLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: React.ReactElement
  isPasswordVisible?: boolean
  setIsPasswordVisible?: (arg: boolean) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

const InputLabel = React.forwardRef<HTMLInputElement, InputLabelProps>(
  ({ label, className, icon, isPasswordVisible, setIsPasswordVisible, type, ...props }, ref) => {
    return (
      <label className="relative block">
        <input
          type={type}
          className={cn(
            'peer flex h-16 w-full rounded-2xl border border-solid border-gray-300 bg-transparent bg-white pl-16 pt-5 text-lg font-semibold transition-colors hover:bg-slate-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
          required
        />
        <span className="absolute left-16 top-5 text-lg leading-150 transition-all peer-autofill:top-2 peer-autofill:mb-8 peer-autofill:text-sm peer-valid:top-2 peer-valid:mb-8 peer-valid:text-sm peer-focus:top-2 peer-focus:mb-8 peer-focus:text-sm">
          {label}
        </span>
        {typeof isPasswordVisible === 'boolean' && setIsPasswordVisible && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-5 top-4"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <BsEye size={24} color="#4C6C93" />
            ) : (
              <BsEyeSlash size={24} color="#4C6C93" />
            )}
          </Button>
        )}
        {icon}
      </label>
    )
  }
)
InputLabel.displayName = 'InputLabel'

export { Input, InputLabel }
