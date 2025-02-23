'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { SignUpFormData } from '@/types/auth';

export default function SignUpForm() {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    birthDate: '',
    gender: 'other',
    height: 0,
    activityLevel: 'sedentary',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'height') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません。');
      setLoading(false);
      return;
    }

    try {
      // Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.displayName,
            birth_date: formData.birthDate,
            gender: formData.gender,
            height: formData.height,
            activity_level: formData.activityLevel,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        if (authError.message.includes('security purposes')) {
          throw new Error('セキュリティのため、しばらく待ってから再度お試しください。');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('ユーザー登録に失敗しました。');
      }

      router.push('/auth/verify');
    } catch (err) {
      console.error('Signup error:', err);
      const error = err as Error;
      setError(error.message || '登録に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          メールアドレス
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          パスワード
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          パスワード（確認）
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
          表示名
        </label>
        <div className="mt-1">
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            value={formData.displayName}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
          生年月日
        </label>
        <div className="mt-1">
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            required
            value={formData.birthDate}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          性別
        </label>
        <div className="mt-1">
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="height" className="block text-sm font-medium text-gray-700">
          身長 (cm)
        </label>
        <div className="mt-1">
          <input
            id="height"
            name="height"
            type="number"
            min="0"
            max="300"
            step="0.1"
            required
            value={formData.height || ''}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
          活動レベル
        </label>
        <div className="mt-1">
          <select
            id="activityLevel"
            name="activityLevel"
            required
            value={formData.activityLevel}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="sedentary">座り仕事が多い</option>
            <option value="lightly_active">軽い運動をする</option>
            <option value="moderately_active">中程度の運動をする</option>
            <option value="very_active">激しい運動をする</option>
            <option value="extra_active">非常に激しい運動をする</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? '登録中...' : '登録する'}
        </button>
      </div>
    </form>
  );
}
