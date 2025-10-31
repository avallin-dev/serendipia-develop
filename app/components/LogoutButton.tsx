'use client'

import Link from 'next/link'

export default function LogoutButton() {
  return (
    <Link href="/logout" prefetch={true}>
      Cerrar sesión
    </Link>
  )
}
