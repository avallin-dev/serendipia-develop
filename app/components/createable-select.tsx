'use client'

import clsx from 'clsx'
import { forwardRef } from 'react'
import Select, { GroupBase } from 'react-select'
import CreatableSelect from 'react-select/creatable'

const controlStyles = {
  base: 'border border-border rounded-lg bg-background hover:cursor-pointer',
  focus: 'border-border ring-ring ring-primary-500',
  nonFocus: 'border-border',
}
const placeholderStyles = 'text-muted-foreground text-sm ml-1 text-xs'
const selectInputStyles = 'text-foreground text-sm ml-1'
const valueContainerStyles = 'text-foreground text-sm'
const singleValueStyles = 'ml-1'
const multiValueStyles =
  'ml-1 bg-background border border-border rounded items-center py-0.5 pl-2 pr-1 gap-1.5'
const multiValueLabelStyles = 'leading-6 py-0.5'
const multiValueRemoveStyles =
  'border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md bg-background'
const indicatorsContainerStyles = 'p-1 gap-1 bg-background rounded-lg'
const clearIndicatorStyles = 'text-gray-500 p-1 rounded-md hover:text-red-800'
const indicatorSeparatorStyles = 'bg-mutated'
const dropdownIndicatorStyles = 'p-1 hover:text-foreground text-gray-500'
const menuStyles = 'mt-2 p-2 border border-border bg-background text-sm rounded-lg'
const optionsStyle = 'bg-background p-2 border-0 text-base hover:bg-gray-100 hover:cursor-pointer'
const groupHeadingStyles = 'ml-3 mt-2 mb-1 text-gray-500 text-sm bg-background'
const noOptionsMessageStyles = 'text-muted-foreground bg-background'

type Option = GroupBase<string> & {
  value: string
  label: string
}

type SelectComponentProps = {
  options: Option[]
  value: string
  onChange?: (value: string) => void
  isDisabled?: boolean
  isLoading?: boolean
  createAble: boolean
  placeholder?: string
}

export const SelectComponent = forwardRef<HTMLInputElement, SelectComponentProps>(
  (
    { options, value, onChange, isDisabled, isLoading, createAble, placeholder, ...props },
    _ref
  ) => {
    const SelectComponent = createAble ? CreatableSelect : Select

    const currentValue = value
      ? options.find((option) => option.value === value) || { value, label: value }
      : null

    return (
      <SelectComponent
        unstyled
        isClearable
        isSearchable
        value={currentValue}
        isDisabled={isDisabled}
        isLoading={isLoading}
        placeholder={placeholder}
        options={options}
        noOptionsMessage={() => 'No options found !!'}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(newValue: any) => {
          if (onChange) {
            onChange(newValue?.value || '')
          }
        }}
        classNames={{
          control: ({ isFocused }) =>
            clsx(isFocused ? controlStyles.focus : controlStyles.nonFocus, controlStyles.base),
          placeholder: () => placeholderStyles,
          input: () => selectInputStyles,
          option: () => optionsStyle,
          menu: () => menuStyles,
          valueContainer: () => valueContainerStyles,
          singleValue: () => singleValueStyles,
          multiValue: () => multiValueStyles,
          multiValueLabel: () => multiValueLabelStyles,
          multiValueRemove: () => multiValueRemoveStyles,
          indicatorsContainer: () => indicatorsContainerStyles,
          clearIndicator: () => clearIndicatorStyles,
          indicatorSeparator: () => indicatorSeparatorStyles,
          dropdownIndicator: () => dropdownIndicatorStyles,
          groupHeading: () => groupHeadingStyles,
          noOptionsMessage: () => noOptionsMessageStyles,
        }}
        {...props}
      />
    )
  }
)

SelectComponent.displayName = 'SelectComponent'
