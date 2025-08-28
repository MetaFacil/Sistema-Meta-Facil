import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to auth pages when not logged in
    if (pathname.startsWith('/auth/')) {
      if (token) {
        // Redirect logged-in users away from auth pages
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.next();
    }

    // Allow access to all API routes
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // Protect all other routes
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Always allow access to auth pages
        if (pathname.startsWith('/auth/')) {
          return true;
        }

        // Allow access to all API routes
        if (pathname.startsWith('/api/')) {
          return true;
        }

        // Require token for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};