import { Inter } from 'next/font/google'

import { getFormTitle } from '@/app/actions/configuration'
const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'
export default async function FormTitle() {
  const formTitle = await getFormTitle()

  return (
    <h2 className="mb-5 whitespace-normal text-center font-bold text-secondary-foreground drop-shadow sm:mb-8">
      <span className={inter.className} style={{ fontSize: 'clamp(28px, 6.5vw, 34px)' }}>
        {formTitle}
      </span>
    </h2>
  )
}
