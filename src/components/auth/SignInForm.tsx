'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { handleAuthError } from '@/utils/error';
import type { FormState } from '@/types';

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ loading: true, error: null });

    try {
      const formData = new FormData(e.currentTarget);
      const data: SignInFormData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      const { error } = await supabase.auth.signInWithPassword(data);

      if (error) throw error;

      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      setFormState(prev => ({
        ...prev,
        error: handleAuthError(error),
      }));
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          パスワード
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {formState.error && (
        <div className="text-red-600 text-sm">{formState.error}</div>
      )}

      <div>
        <button
          type="submit"
          disabled={formState.loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {formState.loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </div>
    </form>
  );
}
