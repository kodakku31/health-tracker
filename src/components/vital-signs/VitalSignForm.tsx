'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface VitalSignFormProps {
  onSubmit: (data: {
    weight: number | null;
    systolic_bp: number | null;
    diastolic_bp: number | null;
    heart_rate: number | null;
    body_temperature: number | null;
    measured_at: string;
  }) => Promise<void>;
}

export default function VitalSignForm({ onSubmit }: VitalSignFormProps) {
  const { user } = useAuth();
  const [weight, setWeight] = useState<string>('');
  const [systolicBp, setSystolicBp] = useState<string>('');
  const [diastolicBp, setDiastolicBp] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [bodyTemperature, setBodyTemperature] = useState<string>('');
  const [measuredAt, setMeasuredAt] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await onSubmit({
        weight: weight ? parseFloat(weight) : null,
        systolic_bp: systolicBp ? parseInt(systolicBp) : null,
        diastolic_bp: diastolicBp ? parseInt(diastolicBp) : null,
        heart_rate: heartRate ? parseInt(heartRate) : null,
        body_temperature: bodyTemperature ? parseFloat(bodyTemperature) : null,
        measured_at: measuredAt,
      });

      // フォームをリセット
      setWeight('');
      setSystolicBp('');
      setDiastolicBp('');
      setHeartRate('');
      setBodyTemperature('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '記録の保存に失敗しました。');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4">バイタルサインを記録</h3>

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
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="systolic-bp"
            className="block text-sm font-medium text-gray-700"
          >
            収縮期血圧 (mmHg)
          </label>
          <input
            type="number"
            id="systolic-bp"
            value={systolicBp}
            onChange={(e) => setSystolicBp(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="diastolic-bp"
            className="block text-sm font-medium text-gray-700"
          >
            拡張期血圧 (mmHg)
          </label>
          <input
            type="number"
            id="diastolic-bp"
            value={diastolicBp}
            onChange={(e) => setDiastolicBp(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="heart-rate"
            className="block text-sm font-medium text-gray-700"
          >
            心拍数 (bpm)
          </label>
          <input
            type="number"
            id="heart-rate"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="body-temperature"
            className="block text-sm font-medium text-gray-700"
          >
            体温 (℃)
          </label>
          <input
            type="number"
            id="body-temperature"
            step="0.1"
            value={bodyTemperature}
            onChange={(e) => setBodyTemperature(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="measured-at"
            className="block text-sm font-medium text-gray-700"
          >
            測定日
          </label>
          <input
            type="date"
            id="measured-at"
            value={measuredAt}
            onChange={(e) => setMeasuredAt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          記録する
        </button>
      </div>
    </form>
  );
}
