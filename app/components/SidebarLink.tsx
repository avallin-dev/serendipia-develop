'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarLinkProps {
  href: string
  icon: JSX.Element
  label: string
  state?: boolean
}

export default function SidebarLink({ href, label, icon, state }: SidebarLinkProps) {
  const pathname = usePathname()
  const isRoute: boolean = pathname.startsWith(href)

  return (
    <li>
      <Link
        href={href}
        className={`mb-4 flex items-center gap-x-2 whitespace-nowrap border-r-4 px-8 py-7 text-lg font-medium transition-colors hover:bg-white/20 md:gap-x-5 md:px-4 lg:text-xl ${
          isRoute
            ? 'pointer-events-none select-none border-primary font-semibold text-primary'
            : 'hover:bg-neutral-light border-transparent text-white'
        }`}
      >
        <div className={`flex-shrink-0 ${isRoute ? '' : 'brightness-0 invert'}`}>{icon}</div>
        <span
          className={`${state === false ? 'opacity-0' : 'opacity-100'}`}
          style={{ transition: 'ease-in-out 0.5s opacity' }}
        >
          {label}
        </span>
      </Link>
    </li>
  )
}
