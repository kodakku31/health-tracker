'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Exercise, ExerciseType } from '@/types';

interface ExerciseFormProps {
  onSubmit?: (exercise: Exercise) => void;
}

const exerciseTypes: ExerciseType[] = [
  'walking',
  'running',
  'cycling',
  'swimming',
  'weight_training',
  'yoga',
  'other',
];

const exerciseTypeLabels: Record<ExerciseType, string> = {
  walking: 'ウォーキング',
  running: 'ランニング',
  cycling: 'サイクリング',
  swimming: '水泳',
  weight_training: 'ウェイトトレーニング',
  yoga: 'ヨガ',
  other: 'その他',
};

export default function ExerciseForm({ onSubmit }: ExerciseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    start_time: '',
    end_time: '',
    exercise_type: 'walking' as ExerciseType,
    calories_burned: '',
    notes: '',
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          router.push('/auth/signin');
          return;
        }

        const { data, error } = await supabase.from('exercises').insert([
          {
            user_id: user.id,
            start_time: formData.start_time,
            end_time: formData.end_time,
            exercise_type: formData.exercise_type,
            calories_burned: parseInt(formData.calories_burned),
            notes: formData.notes || null,
          },
        ]).select().single();

        if (error) throw error;
        if (!data) throw new Error('Exercise data not found after insert');

        if (onSubmit) {
          onSubmit(data);
        }

        setFormData({
          start_time: '',
          end_time: '',
          exercise_type: 'walking',
          calories_burned: '',
          notes: '',
        });

        router.refresh();
      } catch (error) {
        console.error('Error saving exercise:', error);
        alert('運動記録の保存中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    },
    [formData, onSubmit, router]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="start_time"
            className="block text-sm font-medium text-gray-700"
          >
            開始時刻
          </label>
          <input
            type="datetime-local"
            id="start_time"
            name="start_time"
            required
            value={formData.start_time}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="end_time"
            className="block text-sm font-medium text-gray-700"
          >
            終了時刻
          </label>
          <input
            type="datetime-local"
            id="end_time"
            name="end_time"
            required
            value={formData.end_time}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="exercise_type"
          className="block text-sm font-medium text-gray-700"
        >
          運動の種類
        </label>
        <select
          id="exercise_type"
          name="exercise_type"
          required
          value={formData.exercise_type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {exerciseTypes.map((type) => (
            <option key={type} value={type}>
              {exerciseTypeLabels[type]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="calories_burned"
          className="block text-sm font-medium text-gray-700"
        >
          消費カロリー (kcal)
        </label>
        <input
          type="number"
          id="calories_burned"
          name="calories_burned"
          required
          min="0"
          value={formData.calories_burned}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          メモ
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}
