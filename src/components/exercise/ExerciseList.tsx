'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Exercise } from '@/types';

interface ExerciseListProps {
  exercises: Exercise[];
  onDelete?: (id: string) => void;
}

const exerciseTypeLabels: Record<string, string> = {
  walking: 'ウォーキング',
  running: 'ランニング',
  cycling: 'サイクリング',
  swimming: '水泳',
  weight_training: 'ウェイトトレーニング',
  yoga: 'ヨガ',
  other: 'その他',
};

export default function ExerciseList({ exercises, onDelete }: ExerciseListProps) {
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {format(new Date(exercise.start_time), 'PPP p', { locale: ja })}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-medium">
                  {exerciseTypeLabels[exercise.exercise_type]}
                </h3>
              </div>
              {onDelete && (
                <button
                  onClick={() => handleDelete(exercise.id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  削除
                </button>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">消費カロリー</dt>
                <dd className="mt-1">{exercise.calories_burned} kcal</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">時間</dt>
                <dd className="mt-1">
                  {format(new Date(exercise.start_time), 'p')} - {format(new Date(exercise.end_time), 'p')}
                </dd>
              </div>
            </div>

            {exercise.notes && (
              <div className="mt-4">
                <dt className="text-sm font-medium text-gray-500">メモ</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {exercise.notes}
                </dd>
              </div>
            )}
          </div>
        </div>
      ))}

      {exercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">運動記録がありません</p>
        </div>
      )}
    </div>
  );
}
