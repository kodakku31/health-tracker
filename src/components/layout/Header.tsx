'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const { user } = useAuth();
  const currentPath = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === path;
    }
    return currentPath?.startsWith(path);
  };

  const navItems = [
    { path: '/dashboard', label: 'ダッシュボード' },
    { path: '/vital-signs', label: 'バイタルサイン' },
    { path: '/exercise', label: '運動記録' },
    { path: '/nutrition', label: '食事記録' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Health Tracker
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`${
                      isActive(item.path)
                        ? 'font-bold text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    } transition-colors duration-200`}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = '/';
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900"
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
