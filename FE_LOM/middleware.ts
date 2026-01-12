import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get auth cookie
  const authCookie = request.cookies.get('__a~');
  
  // Protected routes (everything except auth routes)
  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login');
  
  // If trying to access protected route without auth cookie, redirect to login
  if (isProtectedRoute && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If already logged in and trying to access login page, redirect to home
  if (request.nextUrl.pathname === '/login' && authCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
