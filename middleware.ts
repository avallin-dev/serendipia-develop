import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const TOKEN_NAME = process.env.TOKEN || ''
  const JWT_SECRET = process.env.JWT_SECRET || ''
  const jwt = request.cookies.get(TOKEN_NAME)

  const { pathname }: { pathname: string } = request.nextUrl
  const partnerRoutes = ['/routines', '/boards', '/memberships', '/samples', '/qr', '/profile']
  const isRoot = pathname === '/'

  if (!jwt) {
    return NextResponse.redirect(new URL('/login-partner', request.url))
  } else {
    try {
      const { payload: token } = await jwtVerify(jwt.value, new TextEncoder().encode(JWT_SECRET))
      if (token.role === 'admin') {
        if (pathname.startsWith('/admin')) {
          return NextResponse.next()
        } else if (partnerRoutes.includes(pathname) || isRoot) {
          return NextResponse.redirect(new URL('/admin/boards', request.url))
        }
      } else if (token.role === 'partner') {
        if (partnerRoutes.includes(pathname)) {
          return NextResponse.next()
        } else if (pathname.startsWith('/admin')) {
          return NextResponse.redirect(new URL('/routines', request.url))
        }
      } else {
        return NextResponse.redirect(new URL('/login-partner', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login-partner', request.url))
    }
  }
}

export const config = {
  matcher: [
    '/',
    '/routines',
    '/boards',
    '/boards/:path',
    '/memberships',
    '/samples',
    '/qr',
    '/profile',
    '/admin',
    '/pilates',
    '/admin/:path*',
  ],
}
