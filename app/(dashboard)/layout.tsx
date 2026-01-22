'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Image from 'next/image'

import { AuthProvider } from '@/app/context/AuthProvider'
import Sidebar from '@/components/Sidebar'
import Widget from "@/components/widget";

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
      key: 'readme',
      icon: <Image src="/images/icons/readme-svgrepo-com.png" alt="" width={28} height={28} />,
      label: 'Paso a Paso',
      href: '/readme',
    },
    {
      key: 'routines',
      icon: <Image src="/images/icons/layersrutinas.png" alt="" width={28} height={28} />,
      label: 'Plan de entrenamiento',
      href: '/routines',
    },
    {
      key: 'memberships',
      icon: <Image src="/images/icons/membership.png" alt="" width={28} height={28} />,
      label: 'Membresias',
      href: '/memberships',
    },
    {
      key: 'samples',
      icon: <Image src="/images/icons/inicio.png" alt="" width={28} height={28} />,
      label: 'Muestras',
      href: '/samples',
    },
    {
      key: 'boards',
      icon: <Image src="/images/icons/Vectorpizarras.png" alt="" width={28} height={28} />,
      label: 'Pizarras',
      href: '/boards',
    },
    {
      key: 'pilates',
      icon: <Image src="/images/icons/pilates-3-svgrepo-com.png" alt="" width={28} height={28} />,
      label: 'Pilates',
      href: '/pilates',
    },
    {
      key: 'qr',
      icon: <Image src="/images/icons/infoinfo.png" alt="" width={28} height={28} />,
      label: 'QR de Socio',
      href: '/qr',
    },
    {
      key: 'profile',
      icon: <Image src="/images/icons/usersperfil.png" alt="" width={28} height={28} />,
      label: 'Perfil',
      href: '/profile',
    },
  ]

  return (
    
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Sidebar menuElements={menuElements}>{children}</Sidebar>
        <audio id="stop" src="/audio/stop.mp3" preload="auto" muted={false}></audio>
        <Widget/>
      </QueryClientProvider>
    </AuthProvider>
  )
}
