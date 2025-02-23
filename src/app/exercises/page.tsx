'use client';

import { useEffect, useState, useCallback } from 'react';
import { Exercise } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ExerciseList from '@/components/exercise/ExerciseList';
import ExerciseForm from '@/components/exercise/ExerciseForm';
import ExerciseSummary from '@/components/exercise/ExerciseSummary';

export default function ExercisesPage() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error: err } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (err) throw err;
      setExercises(data || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('運動記録の取得中にエラーが発生しました。');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchExercises();
    }
    setLoading(false);
  }, [user, fetchExercises]);

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">運動記録</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 運動記録フォーム */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">新規記録</h2>
            <ExerciseForm onSuccess={fetchExercises} onExerciseCreated={handleExerciseCreated} />
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
