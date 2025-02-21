'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ExerciseForm from '@/components/exercise/ExerciseForm';
import ExerciseList from '@/components/exercise/ExerciseList';
import ExerciseSummary from '@/components/exercise/ExerciseSummary';
import type { Exercise } from '@/types';

export default function ExercisesPage() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, [user]);

  const fetchExercises = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (error) throw error;
      setExercises(data || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('運動記録の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseCreated = (newExercise: Exercise) => {
    setExercises([newExercise, ...exercises]);
  };

  const handleExerciseUpdated = (updatedExercise: Exercise) => {
    setExercises(exercises.map(exercise => 
      exercise.id === updatedExercise.id ? updatedExercise : exercise
    ));
  };

  const handleExerciseDeleted = (exerciseId: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">運動記録</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 運動記録フォーム */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">新規記録</h2>
            <ExerciseForm onExerciseCreated={handleExerciseCreated} />
          </div>
        </div>

        {/* 運動記録リストとサマリー */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">サマリー</h2>
            <ExerciseSummary exercises={exercises} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">記録一覧</h2>
            <ExerciseList
              exercises={exercises}
              onExerciseUpdated={handleExerciseUpdated}
              onExerciseDeleted={handleExerciseDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
