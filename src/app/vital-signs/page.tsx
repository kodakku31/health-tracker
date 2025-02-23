'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import VitalSignForm from '@/components/vital-signs/VitalSignForm';
import VitalSignList from '@/components/vital-signs/VitalSignList';
import VitalSignChart from '@/components/vital-signs/VitalSignChart';
import VitalSignGoalForm from '@/components/vital-signs/VitalSignGoalForm';
import VitalSignStats from '@/components/vital-signs/VitalSignStats';
import type { VitalSign, VitalSignGoal } from '@/types';

export default function VitalSignsPage() {
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [goal, setGoal] = useState<VitalSignGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<'weight' | 'blood_pressure' | 'heart_rate' | 'body_temperature'>('weight');

  const fetchVitalSigns = async () => {
    try {
      const { data, error: err } = await supabase
        .from('vital_signs')
        .select('*')
        .order('measured_at', { ascending: false });

      if (err) throw err;
      setVitalSigns(data || []);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchGoal = async () => {
    try {
      const { data, error: err } = await supabase
        .from('vital_sign_goals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (err) throw err;
      setGoal(data || null);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (error: Error) => {
    console.error('Error:', error);
    setError('データの取得中にエラーが発生しました。');
    setLoading(false);
  };

  useEffect(() => {
    Promise.all([fetchVitalSigns(), fetchGoal()])
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VitalSignForm onSuccess={fetchVitalSigns} />
        <VitalSignGoalForm goal={goal} onSuccess={fetchGoal} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">トレンド</h3>
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value as any)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="weight">体重</option>
            <option value="blood_pressure">血圧</option>
            <option value="heart_rate">心拍数</option>
            <option value="body_temperature">体温</option>
          </select>
        </div>
        <VitalSignChart
          vitalSigns={vitalSigns}
          goal={goal}
          type={selectedChart}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">統計情報</h3>
        <VitalSignStats vitalSigns={vitalSigns} goal={goal} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">記録一覧</h3>
        <VitalSignList
          vitalSigns={vitalSigns}
          onDelete={fetchVitalSigns}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
}
