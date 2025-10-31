import { getConfig } from '@/app/actions/configuration'

import UpdateConfig from './_components/UpdateConfig'

export const dynamic = 'force-dynamic'
export default async function Page() {
  const setup = await getConfig()
  return (
    <div className="flex flex-grow flex-col items-center justify-center md:flex-grow-0">
      <h2 className="mb-8 whitespace-nowrap text-center text-4xl font-bold text-secondary">
        Configuración
      </h2>
      <div className="relative w-full sm:max-w-xl">
        <UpdateConfig setup={setup} />
      </div>
    </div>
  )
}
