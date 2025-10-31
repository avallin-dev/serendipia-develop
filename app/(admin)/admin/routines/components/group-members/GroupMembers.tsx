import { socio } from '@prisma/client'
import { TrashIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

import { usePartnersByType } from '@/app/services/queries/partner'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { AddMember } from './AddMember'
import DeleteMember from './DeleteMember'

type GroupMembersProps = {
  members?: socio[] | null
  partnerId: number
  type: 'bloque' | 'grupo' | 'socio'
}

export function GroupMembers({ members, partnerId, type }: GroupMembersProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<number>()
  const { partners } = usePartnersByType('socio')
  const [membersState, setMembersState] = useState<socio[]>(members ?? [])

  return (
    <div className="mt-4">
      <div className="mb-2 font-bold">Miembros del Grupo</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {membersState?.map((member) => (
            <TableRow key={member.idSocio}>
              <TableCell>{`${member.Nombre} ${member.Paterno}`}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setSelectedMemberId(member.idSocio)
                    setIsDeleteModalOpen(true)
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2}>
              <Button variant="secondary" onClick={() => setIsAddModalOpen(true)}>
                Añadir Miembro
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <AddMember
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        type={type}
        partners={partners as unknown as socio[]}
        partnerId={partnerId}
        setMembersState={setMembersState}
      />

      <DeleteMember
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        id={selectedMemberId}
        type={type}
        setMembersState={setMembersState}
      />
    </div>
  )
}
