'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  const navigation = [
    { name: 'ダッシュボード', href: '/dashboard' },
    { name: '運動記録', href: '/exercises' },
    { name: 'バイタルサイン', href: '/vital-signs' },
    { name: '食事記録', href: '/nutrition' },
  ];

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                HealthTracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive(item.href)
                      ? 'border-b-2 border-indigo-500 text-gray-900'
                      : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ログアウト
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-500 hover:text-gray-700"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
