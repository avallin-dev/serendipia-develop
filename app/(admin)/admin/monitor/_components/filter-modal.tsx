/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { LuFilterX } from 'react-icons/lu'

import { Combobox } from '@/app/components/Combobox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { useAllUsersEvenSuperAdmin } from '@/app/services/queries/user'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onFilter: any
}

export function FilterModal({ isOpen, onClose, onFilter }: FilterModalProps) {
  const [filters, setFilters] = useState<any>({})
  const [hasPlan, setHasPlan] = useState<'all' | 'withPlan' | 'withoutPlan'>('all')

  const { users } = useAllUsersEvenSuperAdmin()
  const partnerData = users.map((e) => ({
    value: e.idUsuario.toString(),
    label: `${e.Nombre} `,
  }))

  const handleInputChange = ({ name, value }: { name: string; value: string }) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    const finalFilters: any = { ...filters }
    if (hasPlan === 'withPlan') {
      finalFilters.idPlan = { not: null }
    } else if (hasPlan === 'withoutPlan') {
      finalFilters.idPlan = null
    }

    onFilter(finalFilters)
    onClose()
  }

  const handleClean = () => {
    setFilters({})
    setHasPlan('all')
    onFilter({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrar sala</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label>Nombre</label>
          <Input
            name="Nombre"
            placeholder="Nombre"
            value={filters.Nombre || ''}
            onChange={(e) => handleInputChange({ name: e.target.name, value: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label>DNI</label>
          <Input
            name="DNI"
            placeholder="DNI"
            value={filters.DNI || ''}
            onChange={(e) => handleInputChange({ name: e.target.name, value: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label>Profesor</label>
          <Combobox
            data={partnerData}
            placeholder="Profesor"
            onChange={(e) => handleInputChange({ name: 'idUsuario', value: e })}
            value={filters.idUsuario?.toString() || ''}
          />
        </div>
        <div className="space-y-2">
          <label>Nivel</label>
          <Select
            name="nivel"
            value={filters.nivel}
            onValueChange={(e) => handleInputChange({ name: 'nivel', value: e })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Niveles</SelectLabel>
                <SelectItem value="AVANZADO">AVANZADO</SelectItem>
                <SelectItem value="INTERMEDIO">INTERMEDIO</SelectItem>
                <SelectItem value="INICIAL">INICIAL</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label>Patologías</label>
          <Input
            name="Observaciones"
            placeholder="Observaciones"
            value={filters.Observaciones || ''}
            onChange={(e) => handleInputChange({ name: e.target.name, value: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label>Plan</label>
          <div className="flex gap-2">
            <Button
              variant={hasPlan === 'all' ? 'default' : 'outline'}
              onClick={() => setHasPlan('all')}
            >
              Todos
            </Button>
            <Button
              variant={hasPlan === 'withPlan' ? 'default' : 'outline'}
              onClick={() => setHasPlan('withPlan')}
            >
              Con Plan
            </Button>
            <Button
              variant={hasPlan === 'withoutPlan' ? 'default' : 'outline'}
              onClick={() => setHasPlan('withoutPlan')}
            >
              Sin Plan
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSubmit}>Aplicar Filtros</Button>
          <Button variant="outline" onClick={handleClean}>
            <LuFilterX size={20} />
            Limpiar Filtros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
