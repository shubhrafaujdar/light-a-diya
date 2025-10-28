import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          // If the cookie is updated, update the cookies for the request and response
          const cookieOptions = {
            name,
            value,
            ...options,
            httpOnly: false, // Allow client-side access
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/'
          };
          
          request.cookies.set(cookieOptions)
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set(cookieOptions)
        },
        remove(name: string, options: Record<string, unknown>) {
          // If the cookie is removed, update the cookies for the request and response
          const cookieOptions = {
            name,
            value: '',
            ...options,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 0
          };
          
          request.cookies.set(cookieOptions)
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set(cookieOptions)
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.redirect() or similar, make
  // sure to:
  // 1. Pass the request in it, like so: NextResponse.redirect(url, { request })
  // 2. Copy over the cookies, like so: response.cookies.setAll(supabaseResponse.cookies.getAll())

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/api') &&
    request.nextUrl.pathname !== '/' &&
    request.nextUrl.pathname !== '/aartis' &&
    request.nextUrl.pathname !== '/diya' &&
    request.nextUrl.pathname !== '/offline'
  ) {
    // No redirect for public pages - just refresh the session
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}