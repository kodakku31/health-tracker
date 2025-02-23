'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface VitalSignFormProps {
  onSuccess: () => void;
}

export default function VitalSignForm({ onSuccess }: VitalSignFormProps) {
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
      measured_at: new Date().toISOString(),
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
        .insert([data]);

      if (err) throw err;
      
      formRef.current?.reset();
      onSuccess();
    } catch (err) {
      console.error('Error creating vital sign:', err);
      setError('バイタルサインの記録中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">バイタルサインを記録</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            体重 (kg)
          </label>
          <input
            type="number"
            name="weight"
            id="weight"
            step="0.1"
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
            step="0.1"
            min="30"
            max="45"
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
          {loading ? '記録中...' : '記録する'}
        </button>
      </div>
    </form>
  );
}
