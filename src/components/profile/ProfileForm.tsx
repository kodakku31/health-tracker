'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';

interface ProfileFormProps {
  profile: UserProfile | null;
  onUpdate: (updatedProfile: UserProfile) => void;
}

export default function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    birth_date: profile?.birth_date || '',
    gender: profile?.gender || 'other',
    height: profile?.height || '',
    activity_level: profile?.activity_level || 'sedentary',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile?.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        onUpdate(data);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('プロフィールの更新に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="display_name"
          className="block text-sm font-medium text-gray-700"
        >
          表示名
        </label>
        <input
          type="text"
          id="display_name"
          name="display_name"
          value={formData.display_name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="birth_date"
          className="block text-sm font-medium text-gray-700"
        >
          生年月日
        </label>
        <input
          type="date"
          id="birth_date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
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
          value={formData.gender}
          onChange={handleChange}
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
          value={formData.height}
          onChange={handleChange}
          min="0"
          max="300"
          step="0.1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="activity_level"
          className="block text-sm font-medium text-gray-700"
        >
          活動レベル
        </label>
        <select
          id="activity_level"
          name="activity_level"
          value={formData.activity_level}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="sedentary">座り仕事が多い</option>
          <option value="lightly_active">軽い運動をする</option>
          <option value="moderately_active">中程度の運動をする</option>
          <option value="very_active">激しい運動をする</option>
          <option value="extra_active">非常に激しい運動をする</option>
        </select>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {loading ? '更新中...' : 'プロフィールを更新'}
        </button>
      </div>
    </form>
  );
}
