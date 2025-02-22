'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { VitalSign } from '@/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import VitalSignEditForm from '@/components/vital-signs/VitalSignEditForm';
import { use } from 'react';

export default function VitalSignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [vitalSign, setVitalSign] = useState<VitalSign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    const fetchVitalSign = async () => {
      try {
        const { data, error: err } = await supabase
          .from('vital_signs')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();

        if (err) throw err;
        if (!data) {
          setError('記録が見つかりませんでした。');
          return;
        }

        setVitalSign(data);
      } catch (err) {
        console.error('Error fetching vital sign:', err);
        setError('記録の取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchVitalSign();
  }, [resolvedParams.id, router, user]);

  const handleDelete = async () => {
    if (!confirm('この記録を削除してもよろしいですか？')) return;

    try {
      const { error: err } = await supabase
        .from('vital_signs')
        .delete()
        .eq('id', resolvedParams.id);

      if (err) throw err;
      router.push('/vital-signs');
    } catch (err) {
      console.error('Error deleting vital sign:', err);
      setError('記録の削除中にエラーが発生しました。');
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    router.refresh();
  };

  if (loading) return <div className="p-4">読み込み中...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!vitalSign) return <div className="p-4">記録が見つかりませんでした。</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          バイタルサイン詳細
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {isEditing ? 'キャンセル' : '編集'}
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            削除
          </button>
        </div>
      </div>

      {isEditing ? (
        <VitalSignEditForm
          vitalSign={vitalSign}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">記録日時</h3>
              <p className="mt-1 text-lg">
                {format(new Date(vitalSign.measured_at), 'PPP p', { locale: ja })}
              </p>
            </div>

            {vitalSign.weight && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">体重</h3>
                <p className="mt-1 text-lg">{vitalSign.weight} kg</p>
              </div>
            )}

            {(vitalSign.systolic_bp || vitalSign.diastolic_bp) && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">血圧</h3>
                <p className="mt-1 text-lg">
                  {vitalSign.systolic_bp}/{vitalSign.diastolic_bp} mmHg
                </p>
              </div>
            )}

            {vitalSign.heart_rate && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">心拍数</h3>
                <p className="mt-1 text-lg">{vitalSign.heart_rate} bpm</p>
              </div>
            )}

            {vitalSign.body_temperature && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">体温</h3>
                <p className="mt-1 text-lg">{vitalSign.body_temperature} ℃</p>
              </div>
            )}
          </div>

          {vitalSign.notes && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">メモ</h3>
              <p className="mt-1 text-lg whitespace-pre-wrap">{vitalSign.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
