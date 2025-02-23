'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'ホーム', href: '/' },
    { name: 'バイタルサイン', href: '/vital-signs' },
    { name: '食事記録', href: '/meals' },
  ];

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-500">
                Health Tracker
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center">
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="relative ml-3">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <button
                      onClick={() => signOut()}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      ログアウト
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* モバイルメニュー */}
      {user && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block border-l-4 py-2 pl-3 pr-4 text-base font-medium`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4">
              <div className="px-4 py-2">
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
