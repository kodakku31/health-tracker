'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Exercise } from '@/types';

interface ExerciseFormProps {
  onExerciseCreated: (exercise: Exercise) => void;
}

export default function ExerciseForm({ onExerciseCreated }: ExerciseFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    exercise_type: 'walking',
    start_time: '',
    end_time: '',
    calories_burned: '',
    intensity: 'moderate',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([
          {
            user_id: user.id,
            ...formData,
            calories_burned: parseInt(formData.calories_burned),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        onExerciseCreated(data);
        // フォームをリセット
        setFormData({
          exercise_type: 'walking',
          start_time: '',
          end_time: '',
          calories_burned: '',
          intensity: 'moderate',
          notes: '',
        });
      }
    } catch (err) {
      console.error('Error creating exercise:', err);
      setError('運動記録の作成に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="exercise_type" className="block text-sm font-medium text-gray-700">
          運動の種類
        </label>
        <select
          id="exercise_type"
          name="exercise_type"
          value={formData.exercise_type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="walking">ウォーキング</option>
          <option value="running">ランニング</option>
          <option value="cycling">サイクリング</option>
          <option value="swimming">水泳</option>
          <option value="weight_training">筋力トレーニング</option>
          <option value="yoga">ヨガ</option>
          <option value="stretching">ストレッチ</option>
          <option value="hiit">HIIT</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div>
        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
          開始時間
        </label>
        <input
          type="datetime-local"
          id="start_time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
          終了時間
        </label>
        <input
          type="datetime-local"
          id="end_time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="calories_burned" className="block text-sm font-medium text-gray-700">
          消費カロリー (kcal)
        </label>
        <input
          type="number"
          id="calories_burned"
          name="calories_burned"
          value={formData.calories_burned}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="intensity" className="block text-sm font-medium text-gray-700">
          運動強度
        </label>
        <select
          id="intensity"
          name="intensity"
          value={formData.intensity}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="light">軽い</option>
          <option value="moderate">中程度</option>
          <option value="vigorous">激しい</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          メモ
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
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
          {loading ? '記録中...' : '記録する'}
        </button>
      </div>
    </form>
  );
}
