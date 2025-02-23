'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { VitalSignGoal } from '@/types';

interface VitalSignGoalFormProps {
  initialGoal: VitalSignGoal | null;
  onSubmit: (goal: VitalSignGoal) => void;
}

export default function VitalSignGoalForm({
  initialGoal,
  onSubmit,
}: VitalSignGoalFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    target_weight: initialGoal?.target_weight?.toString() || '',
    target_systolic_bp: initialGoal?.target_systolic_bp?.toString() || '',
    target_diastolic_bp: initialGoal?.target_diastolic_bp?.toString() || '',
    target_heart_rate: initialGoal?.target_heart_rate?.toString() || '',
    notes: initialGoal?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
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

      const data = {
        user_id: user.id,
        target_weight: formData.target_weight ? parseFloat(formData.target_weight) : null,
        target_systolic_bp: formData.target_systolic_bp
          ? parseInt(formData.target_systolic_bp)
          : null,
        target_diastolic_bp: formData.target_diastolic_bp
          ? parseInt(formData.target_diastolic_bp)
          : null,
        target_heart_rate: formData.target_heart_rate
          ? parseInt(formData.target_heart_rate)
          : null,
        notes: formData.notes || null,
      };

      if (initialGoal) {
        const { data: updatedGoal, error } = await supabase
          .from('vital_sign_goals')
          .update(data)
          .eq('id', initialGoal.id)
          .select()
          .single();

        if (error) throw error;
        if (!updatedGoal) throw new Error('Goal data not found after update');

        onSubmit(updatedGoal);
      } else {
        const { data: newGoal, error } = await supabase
          .from('vital_sign_goals')
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        if (!newGoal) throw new Error('Goal data not found after insert');

        onSubmit(newGoal);
      }

      router.refresh();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('目標値の保存中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">目標値を設定</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="target_weight" className="block text-sm font-medium text-gray-700">
            目標体重 (kg)
          </label>
          <input
            type="number"
            id="target_weight"
            name="target_weight"
            step="0.1"
            min="0"
            max="300"
            value={formData.target_weight}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="target_systolic_bp" className="block text-sm font-medium text-gray-700">
            目標収縮期血圧 (mmHg)
          </label>
          <input
            type="number"
            id="target_systolic_bp"
            name="target_systolic_bp"
            min="0"
            max="300"
            value={formData.target_systolic_bp}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="target_diastolic_bp" className="block text-sm font-medium text-gray-700">
            目標拡張期血圧 (mmHg)
          </label>
          <input
            type="number"
            id="target_diastolic_bp"
            name="target_diastolic_bp"
            min="0"
            max="200"
            value={formData.target_diastolic_bp}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="target_heart_rate" className="block text-sm font-medium text-gray-700">
            目標心拍数 (bpm)
          </label>
          <input
            type="number"
            id="target_heart_rate"
            name="target_heart_rate"
            min="0"
            max="300"
            value={formData.target_heart_rate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
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
