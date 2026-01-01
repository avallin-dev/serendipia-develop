import type {Metadata} from 'next'
import {Noto_Sans} from 'next/font/google'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'
import {Toaster} from '@/components/ui/sonner'

const noto = Noto_Sans({subsets: ['latin'], preload: true, display: 'swap'})

export const metadata: Metadata = {
    title: 'Serendipia Gym',
    description: 'Socios serendipia',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
        <body className={noto.className}>
        {/*<script src="https://sdk.mercadopago.com/js/v2"></script>*/}
        <NextTopLoader
            color="#FFFF00"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
        />
        {children}
        <Toaster expand={false}/>
        </body>
        </html>
    )
}
