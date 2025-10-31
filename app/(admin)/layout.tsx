'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Image from 'next/image'

import Sidebar from './admin/_components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 5,
        retryDelay: 1000,
      },
    },
  })

  const menuElements = [
    {
      key: 'dashboard',
      icon: <Image src="/images/icons/dashboard-2-svgrepo-com.png" alt="" width={28} height={28} />,
      label: 'Dashboard',
      href: '/admin/dashboard',
    },
    {
      key: 'users',
      icon: (
        <Image
          src="/images/icons/users-group-two-rounded-svgrepo-com.png"
          alt=""
          width={28}
          height={28}
        />
      ),
      label: 'Usuarios',
      href: '/admin/users',
    },
    {
      key: 'roles',
      icon: <Image src="/images/icons/user-role-svgrepo-com.png" alt="" width={28} height={28} />,
      label: 'Roles',
      href: '/admin/roles',
    },
    {
      key: 'samples',
      icon: <Image src="/images/icons/layersrutinas.png" alt="" width={28} height={28} />,
      label: 'Muestras',
      href: '/admin/samples',
    },
    {
      key: 'boards',
      icon: <Image src="/images/icons/Vectorpizarras.png" alt="" width={28} height={28} />,
      label: 'Pizarras',
      href: '/admin/boards',
    },
    {
      key: 'previews',
      icon: <Image src="/images/icons/license.png" alt="" width={28} height={28} />,
      label: 'Certficados',
      href: '/admin/reviews',
    },
    {
      key: 'notifications',
      icon: <Image src="/images/icons/notifications.png" alt="" width={28} height={28} />,
      label: 'Notificar',
      href: '/admin/notifications',
    },
    {
      key: 'partner',
      icon: <Image src="/images/icons/partner.png" alt="" width={28} height={28} />,
      label: 'Socios',
      href: '/admin/partner',
    },
    {
      key: 'membership',
      icon: <Image src="/images/icons/membership.png" alt="" width={28} height={28} />,
      label: 'Membresias',
      href: '/admin/membership',
    },
    {
      key: 'exercises',
      icon: (
        <Image src="/images/icons/exercise-game-6-svgrepo-com.png" alt="" width={28} height={28} />
      ),
      label: 'Ejercicios',
      href: '/admin/exercises',
    },
    {
      key: 'categories',
      icon: <Image src="/images/icons/category-2-svgrepo-com.png" alt="" width={28} height={28} />,
      label: 'Categorías',
      href: '/admin/categories',
    },
    {
      key: 'routines',
      icon: <Image src="/images/icons/gym-svgrepo-com.png" alt="" width={28} height={28} />,
      label: 'Rutinas',
      href: '/admin/routines',
    },
    {
      key: 'configuration',
      icon: <Image src="/images/icons/configuration.png" alt="" width={28} height={28} />,
      label: 'Configuracion',
      href: '/admin/configuration',
    },
    {
      key: 'readme',
      icon: <Image src="/images/icons/readme-svgrepo-com.png" alt="" width={28} height={28} />,
      label: 'Paso a paso',
      href: '/admin/readme',
    },
    {
      key: 'pilates',
      icon: <Image src="/images/icons/pilates-3-svgrepo-com.png" alt="" width={28} height={28} />,
      label: 'Pilates',
      href: '/admin/pilates',
    },
    {
      key: 'monitor',
      icon: <Image src="/images/icons/monitor-two-svgrepo-com.png" alt="" width={28} height={28} />,
      label: 'Monitor de sala',
      href: '/admin/monitor',
    },
    {
      key: 'seguimiento_planes',
      icon: <Image src="/images/icons/next-998-svgrepo-com.png" alt="" width={28} height={28} />,
      label: 'Seguimiento de planes',
      href: '/admin/seguimiento_planes',
    },
    {
      key: 'venta_producto',
      icon: <Image src="/images/icons/bag-svgrepo-com.png" alt="" width={28} height={28} />,
      label: 'Venta producto',
      href: '/admin/venta_producto',
    },
  ]

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Sidebar menuElements={menuElements} isAdmin>
        {children}
      </Sidebar>
    </QueryClientProvider>
  )
}
