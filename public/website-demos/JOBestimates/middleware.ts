import { NextRequest, NextResponse } from 'next/server';
import { decrypt, updateSession } from './lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicRoute = path === '/login' || path.startsWith('/_next') || path === '/favicon.ico';
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.name) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Optional: update session expiry on each request if needed
  // return await updateSession(request);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
