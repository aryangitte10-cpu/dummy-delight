import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Define paths that require authentication
const authRequiredPaths = [
  '/create',
  '/settings'
];

// Define paths that require coach role
const coachRequiredPaths = [
  '/create'
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Extracting JWT from cookies (this depends on your authentication setup)
  const idToken = request.cookies.get('idToken')?.value;
  
  // If user is trying to access a protected route and isn't authenticated
  if (authRequiredPaths.some(path => pathname.startsWith(path)) && !idToken) {
    // Redirect to login with redirect back to original path
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // For coach-only routes, we can't do a full check here since
  // we would need to decode and verify the JWT
  // This is a basic check - more robust authorization should be
  // implemented in the RouteGuard component
  
  return NextResponse.next();
} 