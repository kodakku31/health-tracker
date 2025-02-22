'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { VitalSign } from '@/types';
import { format } from 'date-fns';

interface VitalSignEditFormProps {
  vitalSign: VitalSign;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VitalSignEditForm({
  vitalSign,
  onSuccess,
  onCancel,
}: VitalSignEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      measured_at: formData.get('measured_at'),
      weight: formData.get('weight') ? Number(formData.get('weight')) : null,
      systolic_bp: formData.get('systolic_bp') ? Number(formData.get('systolic_bp')) : null,
      diastolic_bp: formData.get('diastolic_bp') ? Number(formData.get('diastolic_bp')) : null,
      heart_rate: formData.get('heart_rate') ? Number(formData.get('heart_rate')) : null,
      body_temperature: formData.get('body_temperature') ? Number(formData.get('body_temperature')) : null,
      notes: formData.get('notes') as string || null,
    };

    try {
      const { error: err } = await supabase
        .from('vital_signs')
        .update(data)
        .eq('id', vitalSign.id);

      if (err) throw err;
      onSuccess();
    } catch (err) {
      console.error('Error updating vital sign:', err);
      setError('記録の更新中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="measured_at" className="block text-sm font-medium text-gray-700">
            記録日時
          </label>
          <input
            type="datetime-local"
            name="measured_at"
            id="measured_at"
            defaultValue={format(new Date(vitalSign.measured_at), "yyyy-MM-dd'T'HH:mm")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            体重 (kg)
          </label>
          <input
            type="number"
            name="weight"
            id="weight"
            defaultValue={vitalSign.weight || ''}
            step="0.1"
            min="0"
            max="300"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="systolic_bp" className="block text-sm font-medium text-gray-700">
            収縮期血圧 (mmHg)
          </label>
          <input
            type="number"
            name="systolic_bp"
            id="systolic_bp"
            defaultValue={vitalSign.systolic_bp || ''}
            min="0"
            max="300"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="diastolic_bp" className="block text-sm font-medium text-gray-700">
            拡張期血圧 (mmHg)
          </label>
          <input
            type="number"
            name="diastolic_bp"
            id="diastolic_bp"
            defaultValue={vitalSign.diastolic_bp || ''}
            min="0"
            max="300"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="heart_rate" className="block text-sm font-medium text-gray-700">
            心拍数 (bpm)
          </label>
          <input
            type="number"
            name="heart_rate"
            id="heart_rate"
            defaultValue={vitalSign.heart_rate || ''}
            min="0"
            max="300"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="body_temperature" className="block text-sm font-medium text-gray-700">
            体温 (℃)
          </label>
          <input
            type="number"
            name="body_temperature"
            id="body_temperature"
            defaultValue={vitalSign.body_temperature || ''}
            step="0.1"
            min="30"
            max="45"
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
          defaultValue={vitalSign.notes || ''}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          キャンセル
        </button>
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
