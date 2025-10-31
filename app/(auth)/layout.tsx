import Image from 'next/image'

import Background from '/public/images/Background.jpg'
import Logo from '/public/images/logo-back.png'

import FormTitle from './_components/FormTitle'
import Frecuency from './_components/Frecuency'

export const dynamic = 'force-dynamic'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative flex min-h-screen flex-col bg-black">
      <Image
        alt="Stretch"
        src={Background}
        quality={100}
        priority
        fill
        sizes="100vw"
        className="pointer-events-none select-none object-cover object-[center_20%] opacity-50"
      />
      <div className="absolute inset-0 h-full w-full backdrop-blur-sm"></div>
      <div className="relative flex flex-col items-center px-5 pb-5 pt-8 sm:flex-grow sm:pt-20 md:px-10">
        <Image
          src={Logo}
          alt="Logo"
          quality={100}
          className="pointer-events-none relative w-full max-w-xs select-none object-contain"
        />
        <div className="h-4 sm:h-8"></div>
        <FormTitle />
        {children}
        <div className="max-w-lg">
          <div className="h-4 sm:h-8"></div>
          <Frecuency />
          <div className="h-4 sm:h-8"></div>
          <p className="last text-justify text-sm font-medium text-secondary-foreground [text-align-last:center]">
            Tené en cuenta que en SERENDIPIA siempre hay espacio y elementos para trabajar de buena
            forma, independientemente de la cantidad de personas que se encuentren entrenando
          </p>
        </div>
      </div>
    </main>
  )
}

export default Layout
