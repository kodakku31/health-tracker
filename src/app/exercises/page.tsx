'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ExerciseForm from '@/components/exercise/ExerciseForm';
import ExerciseList from '@/components/exercise/ExerciseList';
import type { Exercise } from '@/types';

export default function ExercisesPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
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

        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false });

        if (error) throw error;
        setExercises(data || []);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('運動記録の取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [router]);

  const handleExerciseSubmit = (exercise: Exercise) => {
    setExercises((prev) => [exercise, ...prev]);
  };

  const handleExerciseDelete = (id: string) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
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
            運動記録
          </h2>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            新しい運動を記録
          </h3>
          <div className="mt-5">
            <ExerciseForm onSubmit={handleExerciseSubmit} />
          </div>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5">
            運動履歴
          </h3>
          <ExerciseList
            exercises={exercises}
            onDelete={handleExerciseDelete}
          />
        </div>
      </div>
    </div>
  );
}
