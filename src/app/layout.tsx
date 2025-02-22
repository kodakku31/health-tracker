import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Health Tracker',
  description: '健康管理アプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-100`} suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <main className="py-10">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
