import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { permissionsMap } from './lib/permissionsMap';

// Public pages that don't require auth
const authPaths = ['/login', '/register', '/reset-password', '/otp'];

// Create the next-intl middleware (handles locales, etc.)
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, run next-intl's middleware
  const intlResponse = intlMiddleware(request);
  if (intlResponse instanceof NextResponse && intlResponse.redirected) {
    return intlResponse;
  }

  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Strip the locale prefix to compare with auth paths
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, '');
  const isAuthPage = authPaths.includes(pathWithoutLocale);

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}client/get/client/permission`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          local: 'ar',
        },
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to fetch permissions');
      const data = await res.json();
      const perms: string[] = data.data || [];

      const required = permissionsMap[pathWithoutLocale];
      if (required && !perms.includes(required)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      console.error('Permission check failed:', err);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return intlResponse ?? NextResponse.next();
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
