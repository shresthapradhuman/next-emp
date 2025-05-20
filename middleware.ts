import authConfig from '@/auth.config'
import NextAuth from 'next-auth'
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_REDIRECT_URL,
  publicRoutes,
} from './routes'

const { auth } = NextAuth(authConfig)

const isRoutePublic = (pathname: string) => {
  return publicRoutes.some((route) => {
    if (pathname.includes('create') || pathname.endsWith('edit')) {
      return false
    }
    if (route.includes(':path*')) {
      const baseRoute = route.split('/:path*')[0]
      return pathname.startsWith(baseRoute)
    }
    return route === pathname
  })
}

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = isRoutePublic(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_REDIRECT_URL, nextUrl))
    }
    return
  }
  if (!isPublicRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    )
  }
  return
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
