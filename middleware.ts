import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://api.dreamazebook.com/api').replace(/\/+$/, '');
const INTERNAL_API_PATHS = new Set([
  '/api/ping',
  '/api/admin/orders/download-images',
]);

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    if (INTERNAL_API_PATHS.has(pathname)) {
      return NextResponse.next();
    }

    const destination = `${API_BASE}${pathname.replace(/^\/api/, '')}${search}`;
    return NextResponse.rewrite(new URL(destination));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*'
],
};