'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  birthDate: string;
  gender: string;
  height: number;
  activityLevel: string;
}

export default function SignUpForm() {
  const [formState, setFormState] = useState<{
    loading: false;
    error: null | string;
  }>({
    loading: false,
    error: null,
  });

  const validatePassword = (password: string, confirmPassword: string): string | null => {
    if (password.length < 6) {
      return 'パスワードは6文字以上である必要があります。';
    }
    if (password !== confirmPassword) {
      return 'パスワードが一致しません。';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ loading: true, error: null });

    try {
      const formData = new FormData(e.currentTarget);
      const data: SignUpFormData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
        displayName: formData.get('displayName') as string,
        birthDate: formData.get('birthDate') as string,
        gender: formData.get('gender') as string,
        height: parseFloat(formData.get('height') as string) || 0,
        activityLevel: formData.get('activityLevel') as string,
      };

      const validationError = validatePassword(data.password, data.confirmPassword);
      if (validationError) {
        setFormState({ loading: false, error: validationError });
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
            birth_date: data.birthDate,
            gender: data.gender,
            height: data.height,
            activity_level: data.activityLevel,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      window.location.href = '/auth/verify';
    } catch (error) {
      console.error('Error signing up:', error);
      setFormState(prev => ({
        ...prev,
        error: (error as Error).message,
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
          minLength={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          パスワード（確認）
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          minLength={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="displayName"
          className="block text-sm font-medium text-gray-700"
        >
          表示名
        </label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="birthDate"
          className="block text-sm font-medium text-gray-700"
        >
          生年月日
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700"
        >
          性別
        </label>
        <select
          id="gender"
          name="gender"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="height"
          className="block text-sm font-medium text-gray-700"
        >
          身長 (cm)
        </label>
        <input
          type="number"
          id="height"
          name="height"
          required
          min="0"
          max="300"
          step="0.1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="activityLevel"
          className="block text-sm font-medium text-gray-700"
        >
          活動レベル
        </label>
        <select
          id="activityLevel"
          name="activityLevel"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="sedentary">座り仕事が多い</option>
          <option value="lightly_active">軽い運動をする</option>
          <option value="moderately_active">中程度の運動をする</option>
          <option value="very_active">激しい運動をする</option>
          <option value="extra_active">非常に激しい運動をする</option>
        </select>
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
          {formState.loading ? '登録中...' : '登録する'}
        </button>
      </div>
    </form>
  );
}
