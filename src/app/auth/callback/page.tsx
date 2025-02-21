'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // ユーザーが認証済みの場合はダッシュボードへ
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg">認証を確認中...</div>
        <div className="mt-2 text-sm text-gray-500">しばらくお待ちください</div>
      </div>
    </div>
  );
}
