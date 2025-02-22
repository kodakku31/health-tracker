'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { VitalSign } from '@/types';

interface VitalSignListProps {
  vitalSigns: VitalSign[];
  onDelete: (id: string) => void;
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
      onDelete(id);
    } catch (err) {
      console.error('Error deleting vital sign:', err);
      setError('記録の削除中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  if (vitalSigns.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
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
              日時
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
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vitalSigns.map((vitalSign) => (
            <tr key={vitalSign.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Link href={`/vital-signs/${vitalSign.id}`} className="hover:text-indigo-600">
                  {format(new Date(vitalSign.measured_at), 'PPP p', { locale: ja })}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vitalSign.weight ? `${vitalSign.weight} kg` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vitalSign.systolic_bp && vitalSign.diastolic_bp
                  ? `${vitalSign.systolic_bp}/${vitalSign.diastolic_bp}`
                  : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vitalSign.heart_rate ? `${vitalSign.heart_rate} bpm` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vitalSign.body_temperature ? `${vitalSign.body_temperature} ℃` : '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="max-w-xs truncate">
                  {vitalSign.notes || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/vital-signs/${vitalSign.id}`}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  詳細
                </Link>
                <button
                  onClick={() => handleDelete(vitalSign.id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-900"
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
