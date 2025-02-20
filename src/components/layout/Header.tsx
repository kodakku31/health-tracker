'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/signin');
  };

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              HealthTracker
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  ダッシュボード
                </Link>
                <Link
                  href="/vital-signs"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  バイタルサイン
                </Link>
                <Link
                  href="/exercise"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  運動記録
                </Link>
                <Link
                  href="/nutrition"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  食事記録
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  新規登録
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
