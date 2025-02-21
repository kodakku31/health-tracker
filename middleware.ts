import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('=== Middleware Start ===');
  console.log('Request URL:', req.url);
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const requestUrl = new URL(req.url);
  console.log('Current Path:', requestUrl.pathname);
  console.log('Session Status:', session ? 'Authenticated' : 'Not Authenticated');
  if (session) {
    console.log('User Email:', session.user?.email);
    console.log('Session Expires:', new Date(session.expires_at! * 1000).toLocaleString());
  }

  // 保護されたルートの配列
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => 
    requestUrl.pathname.startsWith(route)
  );
  console.log('Is Protected Route:', isProtectedRoute);

  // 認証ルートの配列
  const authRoutes = ['/auth/signin', '/auth/signup'];
  const isAuthRoute = authRoutes.some(route => 
    requestUrl.pathname.startsWith(route)
  );
  console.log('Is Auth Route:', isAuthRoute);

  // 未認証ユーザーが保護されたルートにアクセスした場合
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/auth/signin', req.url);
    console.log('Redirecting Unauthenticated User:', redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  // 認証済みユーザーが認証ルートにアクセスした場合
  if (session && isAuthRoute) {
    const redirectUrl = new URL('/dashboard', req.url);
    console.log('Redirecting Authenticated User:', redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  console.log('=== Middleware End ===');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
