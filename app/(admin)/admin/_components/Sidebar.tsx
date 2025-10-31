'use client'

import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import Image from 'next/image'
import { useState } from 'react'
import { RxHamburgerMenu } from 'react-icons/rx'

import SidebarLink from '@/app/components/SidebarLink'
import { useUserModule } from '@/app/services/queries/user'
import LogoutButton from '@/components/LogoutButton'
import NotificationButton from '@/components/NotifcationButton'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

import Logo from '/public/images/logo-back.png'

import { useMediaQuery } from '@/hooks/useMediaQuery'

type MenuElements = {
  key: string
  icon: JSX.Element
  label: string
  href: string
}[]

export default function Sidebar({
  children,
  menuElements,
  isAdmin = false,
}: {
  children: React.ReactNode
  menuElements: MenuElements
  isAdmin?: boolean
}) {
  const { user } = useUserModule()
  const moduleLabels = user?.rol.rol_modulo.map((e) => e.cmodulo.nombre)
  const [state, setState] = useState(false)
  const md = useMediaQuery('(min-width: 768px)')
  return (
    <div className="flex">
      <div
        className={`group fixed inset-y-0 z-10 hidden min-h-svh flex-shrink-0 flex-col overflow-hidden bg-mine-shaft-900 shadow-xl md:flex ${
          state ? 'w-80' : 'w-16'
        }`}
        style={{ transition: 'ease-in-out 0.5s width' }}
        onClick={() => setState((prevState) => !prevState)}
        onMouseEnter={() => setState(true)}
        onMouseLeave={() => setState(false)}
      >
        <div className="min-h-40 px-5 pt-6">
          <div className="relative hidden h-[120px] w-full justify-center group-hover:flex">
            <Image
              alt="logo"
              src={Logo}
              style={{
                objectFit: 'contain',
                transition: 'ease-in 0.5s opacity',
                transitionDelay: '0.5s',
              }}
              height={120}
              sizes="100%"
              priority
              className={`${state === false ? 'opacity-0' : 'opacity-100'} cursor-pointer`}
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto overflow-x-hidden">
          <div>
            <ul>
              {menuElements.map((e) => {
                if (!moduleLabels?.includes(e.label) && user?.idRol !== 1 && e.label !== 'Pizarras')
                  return
                return (
                  <SidebarLink
                    key={`sidebar_link-${e.key}`}
                    href={e.href}
                    icon={e.icon}
                    label={e.label}
                    state={state}
                  />
                )
              })}
              <Separator />
              <li className="flex cursor-pointer items-center gap-x-5 whitespace-nowrap px-4 py-7 text-lg font-medium text-white transition-colors hover:bg-white/30 lg:text-xl">
                <Image
                  src="/images/icons/log-inlogout.png"
                  alt=""
                  width={28}
                  height={28}
                  className="flex-shrink-0"
                />
                <LogoutButton />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <section className="flex min-h-svh w-full flex-col bg-alabaster md:ml-16 md:w-[calc(100%-4rem)]">
        <header className="flex h-[70px] w-full items-center justify-between gap-x-3 bg-mine-shaft-900 md:h-24 md:justify-end md:bg-white md:px-7">
          <Sheet open={md ? false : state} onOpenChange={setState}>
            <SheetTrigger className="h-full px-4 text-white md:hidden">
              <RxHamburgerMenu color="#FFF" size={20} />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="overflow-y-auto border-0 bg-mine-shaft-900 px-0 pt-8"
            >
              <SheetClose className="absolute left-0 top-0 p-5">
                <RxHamburgerMenu color="#FFF" size={20} />
              </SheetClose>
              <VisuallyHidden.Root asChild>
                <SheetHeader className="space-y-6">
                  <SheetTitle></SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
              </VisuallyHidden.Root>
              <div className="px-5 py-6">
                <div className="relative flex h-[120px] w-full justify-center">
                  <Image
                    fill
                    alt="logo"
                    src={Logo}
                    style={{ objectFit: 'contain' }}
                    sizes="100%"
                    priority
                  />
                </div>
              </div>
              <ul>
                {menuElements.map((e) => {
                  if (
                    !moduleLabels?.includes(e.label) &&
                    user?.idRol !== 1 &&
                    e.label !== 'Pizarras'
                  )
                    return
                  return (
                    <div
                      onClick={() =>
                        setTimeout(() => {
                          setState((prevState) => !prevState)
                        }, 500)
                      }
                      key={`sidebar_link-${e.key}`}
                    >
                      <SidebarLink href={e.href} icon={e.icon} label={e.label} />
                    </div>
                  )
                })}
                <Separator />
                <li className="flex cursor-pointer items-center gap-x-2 px-8 py-6 text-lg font-medium text-white transition-colors hover:bg-white/30 md:px-2 lg:gap-x-4 lg:text-xl">
                  <Image src="/images/icons/log-inlogout.png" alt="" width={28} height={28} />
                  <LogoutButton />
                </li>
              </ul>
            </SheetContent>
          </Sheet>
          <div className="mr-4 flex items-center gap-x-3 md:mr-0">
            {!isAdmin && <NotificationButton />}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex gap-2 focus:ring-0">
                <Avatar>
                  <AvatarImage src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp" />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex-grow overflow-y-auto overflow-x-hidden">
          <div className="p-6">{children}</div>
        </div>
      </section>
    </div>
  )
}
