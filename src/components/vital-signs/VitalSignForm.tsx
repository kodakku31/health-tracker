'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { VitalSign } from '@/types';

interface VitalSignFormProps {
  onSubmit?: (vitalSign: VitalSign) => void;
}

export default function VitalSignForm({ onSubmit }: VitalSignFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    measured_at: '',
    weight: '',
    systolic_bp: '',
    diastolic_bp: '',
    heart_rate: '',
    body_temperature: '',
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

        const { data, error } = await supabase.from('vital_signs').insert([
          {
            user_id: user.id,
            measured_at: formData.measured_at,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            systolic_bp: formData.systolic_bp ? parseInt(formData.systolic_bp) : null,
            diastolic_bp: formData.diastolic_bp ? parseInt(formData.diastolic_bp) : null,
            heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
            body_temperature: formData.body_temperature ? parseFloat(formData.body_temperature) : null,
            notes: formData.notes || null,
          },
        ]).select().single();

        if (error) throw error;
        if (!data) throw new Error('Vital sign data not found after insert');

        if (onSubmit) {
          onSubmit(data);
        }

        setFormData({
          measured_at: '',
          weight: '',
          systolic_bp: '',
          diastolic_bp: '',
          heart_rate: '',
          body_temperature: '',
          notes: '',
        });

        router.refresh();
      } catch (error) {
        console.error('Error saving vital signs:', error);
        alert('バイタルサインの保存中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    },
    [formData, onSubmit, router]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">バイタルサインを記録</h3>
      
      <div>
        <label
          htmlFor="measured_at"
          className="block text-sm font-medium text-gray-700"
        >
          測定日時
        </label>
        <input
          type="datetime-local"
          id="measured_at"
          name="measured_at"
          required
          value={formData.measured_at}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-gray-700"
          >
            体重 (kg)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            step="0.1"
            min="0"
            value={formData.weight}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="body_temperature"
            className="block text-sm font-medium text-gray-700"
          >
            体温 (℃)
          </label>
          <input
            type="number"
            id="body_temperature"
            name="body_temperature"
            step="0.1"
            min="35"
            max="42"
            value={formData.body_temperature}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="systolic_bp"
            className="block text-sm font-medium text-gray-700"
          >
            収縮期血圧 (mmHg)
          </label>
          <input
            type="number"
            id="systolic_bp"
            name="systolic_bp"
            min="0"
            max="300"
            value={formData.systolic_bp}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="diastolic_bp"
            className="block text-sm font-medium text-gray-700"
          >
            拡張期血圧 (mmHg)
          </label>
          <input
            type="number"
            id="diastolic_bp"
            name="diastolic_bp"
            min="0"
            max="200"
            value={formData.diastolic_bp}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="heart_rate"
          className="block text-sm font-medium text-gray-700"
        >
          心拍数 (bpm)
        </label>
        <input
          type="number"
          id="heart_rate"
          name="heart_rate"
          min="0"
          max="300"
          value={formData.heart_rate}
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
