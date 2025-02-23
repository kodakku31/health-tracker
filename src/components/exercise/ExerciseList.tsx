'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { handleError } from '@/utils/error';
import { formatDateTime } from '@/utils/common';
import type { Exercise, FormState } from '@/types';

interface ExerciseListProps {
  exercises: Exercise[];
  onDelete: (id: string) => void;
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
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
  });

  const handleDelete = async (id: string) => {
    if (!confirm('この記録を削除してもよろしいですか？')) {
      return;
    }

    setFormState({ loading: true, error: null });

    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onDelete(id);
      router.refresh();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      setFormState(prev => ({
        ...prev,
        error: handleError(error).message,
      }));
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  if (exercises.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        運動記録がありません。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {exerciseTypeLabels[exercise.exercise_type]}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDateTime(exercise.start_time)}
                {exercise.end_time &&
                  ` - ${formatDateTime(exercise.end_time)}`}
              </p>
              <div className="mt-2 space-y-1">
                {exercise.duration_minutes && (
                  <p className="text-sm text-gray-600">
                    時間: {exercise.duration_minutes}分
                  </p>
                )}
                {exercise.distance_km && (
                  <p className="text-sm text-gray-600">
                    距離: {exercise.distance_km}km
                  </p>
                )}
                {exercise.calories_burned && (
                  <p className="text-sm text-gray-600">
                    消費カロリー: {exercise.calories_burned}kcal
                  </p>
                )}
                {exercise.notes && (
                  <p className="mt-2 text-sm text-gray-600">{exercise.notes}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(exercise.id)}
              disabled={formState.loading}
              className="text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              削除
            </button>
          </div>
        </div>
      ))}

      {formState.error && (
        <div className="mt-4 text-red-600 text-sm">{formState.error}</div>
      )}
    </div>
  );
}
