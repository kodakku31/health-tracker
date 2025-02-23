'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { handleError } from '@/utils/error';
import { getCurrentUser } from '@/utils/database';
import type { Exercise, ExerciseType, FormState } from '@/types';

interface ExerciseFormData {
  exercise_type: ExerciseType;
  start_time: string;
  end_time: string;
  duration_minutes: string;
  distance_km: string;
  calories_burned: string;
  notes: string;
}

const initialFormData: ExerciseFormData = {
  exercise_type: 'walking',
  start_time: '',
  end_time: '',
  duration_minutes: '',
  distance_km: '',
  calories_burned: '',
  notes: '',
};

const exerciseTypeOptions: { value: ExerciseType; label: string }[] = [
  { value: 'walking', label: 'ウォーキング' },
  { value: 'running', label: 'ランニング' },
  { value: 'cycling', label: 'サイクリング' },
  { value: 'swimming', label: '水泳' },
  { value: 'weight_training', label: 'ウェイトトレーニング' },
  { value: 'yoga', label: 'ヨガ' },
  { value: 'other', label: 'その他' },
];

interface ExerciseFormProps {
  onSubmit?: (exercise: Exercise) => void;
}

export default function ExerciseForm({ onSubmit }: ExerciseFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ExerciseFormData>(initialFormData);
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (data: ExerciseFormData): string | null => {
    if (!data.start_time || !data.end_time) {
      return '開始時刻と終了時刻は必須です。';
    }

    const start = new Date(data.start_time);
    const end = new Date(data.end_time);
    if (end <= start) {
      return '終了時刻は開始時刻より後である必要があります。';
    }

    if (!data.duration_minutes || parseInt(data.duration_minutes) <= 0) {
      return '運動時間は0より大きい値を入力してください。';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ loading: true, error: null });

    try {
      const validationError = validateForm(formData);
      if (validationError) {
        setFormState({ loading: false, error: validationError });
        return;
      }

      const user = await getCurrentUser();

      const { data, error } = await supabase
        .from('exercises')
        .insert([
          {
            user_id: user.id,
            exercise_type: formData.exercise_type,
            start_time: formData.start_time,
            end_time: formData.end_time,
            duration_minutes: parseInt(formData.duration_minutes),
            distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null,
            calories_burned: formData.calories_burned ? parseInt(formData.calories_burned) : null,
            notes: formData.notes || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('運動記録の作成に失敗しました。');

      setFormData(initialFormData);
      if (onSubmit) {
        onSubmit(data);
      }
      router.refresh();
    } catch (error) {
      console.error('Error creating exercise:', error);
      setFormState(prev => ({
        ...prev,
        error: handleError(error).message,
      }));
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          value={formData.exercise_type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {exerciseTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label
            htmlFor="duration_minutes"
            className="block text-sm font-medium text-gray-700"
          >
            運動時間（分）
          </label>
          <input
            type="number"
            id="duration_minutes"
            name="duration_minutes"
            min="1"
            required
            value={formData.duration_minutes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="distance_km"
            className="block text-sm font-medium text-gray-700"
          >
            距離 (km)
          </label>
          <input
            type="number"
            id="distance_km"
            name="distance_km"
            min="0"
            step="0.1"
            value={formData.distance_km}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
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
            min="0"
            value={formData.calories_burned}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
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

      {formState.error && (
        <div className="text-red-600 text-sm">{formState.error}</div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={formState.loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {formState.loading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}
