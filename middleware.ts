import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Public pages that don't require auth
const authPaths = ['/login', '/register', '/reset-password', '/otp'];

// Create the next-intl middleware (handles locales, etc.)
const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  // First, run next-intl's middleware
  const intlResponse = intlMiddleware(request);
  if (intlResponse instanceof NextResponse && intlResponse.redirected) {
    return intlResponse;
  }

  // Now apply auth logic
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Strip the locale prefix to compare with auth paths
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, '');

  const isAuthPage = authPaths.includes(pathWithoutLocale);

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

  return intlResponse ?? NextResponse.next();
}
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
