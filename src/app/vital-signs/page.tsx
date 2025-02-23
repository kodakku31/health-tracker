'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import VitalSignForm from '@/components/vital-signs/VitalSignForm';
import VitalSignList from '@/components/vital-signs/VitalSignList';
import VitalSignStats from '@/components/vital-signs/VitalSignStats';
import VitalSignGoalForm from '@/components/vital-signs/VitalSignGoalForm';
import type { VitalSign, VitalSignGoal } from '@/types';

export default function VitalSignsPage() {
  const router = useRouter();
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [goal, setGoal] = useState<VitalSignGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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

        const [vitalSignsResult, goalResult] = await Promise.all([
          supabase
            .from('vital_signs')
            .select('*')
            .eq('user_id', user.id)
            .order('measured_at', { ascending: false }),
          supabase
            .from('vital_sign_goals')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
        ]);

        if (vitalSignsResult.error) throw vitalSignsResult.error;
        if (goalResult.error) throw goalResult.error;

        setVitalSigns(vitalSignsResult.data || []);
        setGoal(goalResult.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('データの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleVitalSignSubmit = (vitalSign: VitalSign) => {
    setVitalSigns((prev) => [vitalSign, ...prev]);
  };

  const handleVitalSignDelete = (id: string) => {
    setVitalSigns((prev) => prev.filter((vs) => vs.id !== id));
  };

  const handleGoalSubmit = (newGoal: VitalSignGoal) => {
    setGoal(newGoal);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            バイタルサイン
          </h2>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                新しい記録
              </h3>
              <div className="mt-5">
                <VitalSignForm onSubmit={handleVitalSignSubmit} />
              </div>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5">
                記録一覧
              </h3>
              <VitalSignList
                vitalSigns={vitalSigns}
                onDelete={handleVitalSignDelete}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                目標値
              </h3>
              <div className="mt-5">
                <VitalSignGoalForm
                  initialGoal={goal}
                  onSubmit={handleGoalSubmit}
                />
              </div>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                統計情報
              </h3>
              <div className="mt-5">
                <VitalSignStats vitalSigns={vitalSigns} goal={goal} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
