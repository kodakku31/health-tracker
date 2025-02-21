'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import type { VitalSign } from '@/types';

interface VitalSignListProps {
  vitalSigns: VitalSign[];
  onDelete: () => void;
}

export default function VitalSignList({ vitalSigns, onDelete }: VitalSignListProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('この記録を削除してもよろしいですか？')) return;

    setLoading(true);
    setError(null);

    try {
      const { error: err } = await supabase
        .from('vital_signs')
        .delete()
        .eq('id', id);

      if (err) throw err;
      onDelete();
    } catch (err) {
      console.error('Error deleting vital sign:', err);
      setError('記録の削除中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  if (vitalSigns.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        記録がありません
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              測定日時
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              体重
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              血圧
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              心拍数
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              体温
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              メモ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vitalSigns.map((sign) => (
            <tr key={sign.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(sign.measured_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {sign.weight ? `${sign.weight} kg` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {sign.systolic_bp && sign.diastolic_bp
                  ? `${sign.systolic_bp}/${sign.diastolic_bp}`
                  : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {sign.heart_rate ? `${sign.heart_rate} bpm` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {sign.body_temperature ? `${sign.body_temperature} ℃` : '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {sign.notes || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  onClick={() => handleDelete(sign.id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && (
        <div className="text-red-600 text-sm mt-4">{error}</div>
      )}
    </div>
  );
}
