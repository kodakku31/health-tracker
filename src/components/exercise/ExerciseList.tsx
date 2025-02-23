'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Exercise } from '@/types';

interface ExerciseListProps {
  exercises: Exercise[];
  onDelete?: (id: string) => void;
}

export default function ExerciseList({
  exercises,
  onDelete,
}: ExerciseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getExerciseTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      walking: 'ウォーキング',
      running: 'ランニング',
      cycling: 'サイクリング',
      swimming: '水泳',
      weight_training: '筋力トレーニング',
      yoga: 'ヨガ',
      stretching: 'ストレッチ',
      hiit: 'HIIT',
      other: 'その他',
    };
    return types[type] || type;
  };

  const getIntensityLabel = (intensity: string) => {
    const intensities: { [key: string]: string } = {
      light: '軽い',
      moderate: '中程度',
      vigorous: '激しい',
    };
    return intensities[intensity] || intensity;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この記録を削除してもよろしいですか？')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onDelete && onDelete(id);
    } catch (err) {
      console.error('Error deleting exercise:', err);
      alert('削除に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  if (exercises.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        運動記録がありません。新しい記録を追加してください。
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
              運動の種類
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              消費カロリー
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              運動強度
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
          {exercises.map((exercise) => (
            <tr key={exercise.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDateTime(exercise.startTime)} ～
                <br />
                {formatDateTime(exercise.endTime)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getExerciseTypeLabel(exercise.exerciseType)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {exercise.caloriesBurned} kcal
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getIntensityLabel(exercise.intensity)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {exercise.notes}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDelete(exercise.id)}
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
    </div>
  );
}
