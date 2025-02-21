'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { VitalSignGoal } from '@/types';

interface VitalSignGoalFormProps {
  goal?: VitalSignGoal;
  onSuccess: () => void;
}

export default function VitalSignGoalForm({ goal, onSuccess }: VitalSignGoalFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('ログインが必要です。');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      user_id: user.id,
      target_weight: formData.get('target_weight') ? Number(formData.get('target_weight')) : null,
      target_systolic_bp: formData.get('target_systolic_bp') ? Number(formData.get('target_systolic_bp')) : null,
      target_diastolic_bp: formData.get('target_diastolic_bp') ? Number(formData.get('target_diastolic_bp')) : null,
      target_heart_rate: formData.get('target_heart_rate') ? Number(formData.get('target_heart_rate')) : null,
      notes: formData.get('notes') as string || null,
    };

    try {
      if (goal) {
        const { error: err } = await supabase
          .from('vital_sign_goals')
          .update(data)
          .eq('id', goal.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('vital_sign_goals')
          .insert([data]);
        if (err) throw err;
      }

      if (!goal) {
        formRef.current?.reset();
      }
      onSuccess();
    } catch (err) {
      console.error('Error saving vital sign goal:', err);
      setError('目標値の保存中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">目標値を設定</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="target_weight" className="block text-sm font-medium text-gray-700">
            目標体重 (kg)
          </label>
          <input
            type="number"
            name="target_weight"
            id="target_weight"
            defaultValue={goal?.target_weight}
            step="0.1"
            min="0"
            max="300"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="target_systolic_bp" className="block text-sm font-medium text-gray-700">
            目標収縮期血圧 (mmHg)
          </label>
          <input
            type="number"
            name="target_systolic_bp"
            id="target_systolic_bp"
            defaultValue={goal?.target_systolic_bp}
            min="0"
            max="300"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="target_diastolic_bp" className="block text-sm font-medium text-gray-700">
            目標拡張期血圧 (mmHg)
          </label>
          <input
            type="number"
            name="target_diastolic_bp"
            id="target_diastolic_bp"
            defaultValue={goal?.target_diastolic_bp}
            min="0"
            max="300"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="target_heart_rate" className="block text-sm font-medium text-gray-700">
            目標心拍数 (bpm)
          </label>
          <input
            type="number"
            name="target_heart_rate"
            id="target_heart_rate"
            defaultValue={goal?.target_heart_rate}
            min="0"
            max="300"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          メモ
        </label>
        <textarea
          name="notes"
          id="notes"
          defaultValue={goal?.notes}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? '保存中...' : '保存する'}
        </button>
      </div>
    </form>
  );
}
