'use client'

import * as React from 'react'
import { LuCheck, LuChevronsUpDown } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type ComboboxDemoTypeProps = {
  data: {
    label: string | null
    value: string
  }[]
  placeholder: string
  onChange: (value: string) => void
  value: string
  className?: string
  slice?: number
}
export function Combobox({
  data,
  placeholder,
  onChange,
  value,
  className,
  slice,
}: ComboboxDemoTypeProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const filteredItems = data
    .filter((item) => item.label?.toLowerCase().includes(query.toLowerCase()))
    .slice(0, slice ?? 10)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('flex w-full justify-between overflow-hidden', className)}
        >
          {value ? (
            <span className="truncate">
              {data.find((element) => element.value === value)?.label}
            </span>
          ) : (
            <span className="font-normal text-gray-400">{placeholder}</span>
          )}
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" side="bottom">
        <Command>
          <CommandInput placeholder="Buscar" onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No data</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((element) => (
                <CommandItem
                  key={element.value}
                  value={element.label ?? ''}
                  onSelect={() => {
                    onChange(element.value === value ? '' : element.value)
                    setOpen(false)
                  }}
                >
                  <LuCheck
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === element.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {element.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
