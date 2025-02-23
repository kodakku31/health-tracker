'use client';

import { useState } from 'react';
import type { VitalSign } from '@/types';

interface VitalSignFormProps {
  onSubmit: (data: VitalSign) => Promise<void>;
}

export default function VitalSignForm({ onSubmit }: VitalSignFormProps) {
  const [weight, setWeight] = useState('');
  const [systolicBP, setSystolicBP] = useState('');
  const [diastolicBP, setDiastolicBP] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bodyTemperature, setBodyTemperature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit({
        weight: weight ? parseFloat(weight) : null,
        systolic_blood_pressure: systolicBP ? parseInt(systolicBP) : null,
        diastolic_blood_pressure: diastolicBP ? parseInt(diastolicBP) : null,
        heart_rate: heartRate ? parseInt(heartRate) : null,
        body_temperature: bodyTemperature ? parseFloat(bodyTemperature) : null,
        measured_at: new Date().toISOString(),
      });

      // フォームをリセット
      setWeight('');
      setSystolicBP('');
      setDiastolicBP('');
      setHeartRate('');
      setBodyTemperature('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'バイタルサインの登録に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            体重 (kg)
          </label>
          <input
            type="number"
            id="weight"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="systolicBP" className="block text-sm font-medium text-gray-700">
            収縮期血圧 (mmHg)
          </label>
          <input
            type="number"
            id="systolicBP"
            value={systolicBP}
            onChange={(e) => setSystolicBP(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="diastolicBP" className="block text-sm font-medium text-gray-700">
            拡張期血圧 (mmHg)
          </label>
          <input
            type="number"
            id="diastolicBP"
            value={diastolicBP}
            onChange={(e) => setDiastolicBP(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700">
            心拍数 (bpm)
          </label>
          <input
            type="number"
            id="heartRate"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="bodyTemperature" className="block text-sm font-medium text-gray-700">
            体温 (℃)
          </label>
          <input
            type="number"
            id="bodyTemperature"
            step="0.1"
            value={bodyTemperature}
            onChange={(e) => setBodyTemperature(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? '記録中...' : '記録する'}
        </button>
      </div>
    </form>
  );
}
