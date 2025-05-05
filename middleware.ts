import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public pages that don't require auth
const authPaths = ['/login', '/register', '/reset-password', '/otp'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = authPaths.includes(pathname);

  if (!token && !isAuthPage) {
    // If not authenticated and trying to access a protected route
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthPage) {
    // If authenticated and trying to access login/register pages
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }
  return NextResponse.next();
}
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}
