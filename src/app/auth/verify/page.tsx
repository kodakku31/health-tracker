'use client';

import Link from 'next/link';

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            メール認証
          </h2>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              登録したメールアドレスに認証メールを送信しました。
            </p>
            <p className="mt-2 text-sm text-gray-600">
              メール内のリンクをクリックして、アカウントを有効化してください。
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/auth/signin"
            className="text-indigo-600 hover:text-indigo-500"
          >
            ログインページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
