import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 未認証ユーザーをログインページにリダイレクト
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/signin';
    return NextResponse.redirect(redirectUrl);
  }

  // 認証済みユーザーを認証ページからダッシュボードにリダイレクト
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
