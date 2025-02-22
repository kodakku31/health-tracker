'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Meal } from '@/types';
import MealForm from '@/components/meals/MealForm';
import MealList from '@/components/meals/MealList';

export default function MealsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('list');

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    const fetchMeals = async () => {
      try {
        const { data, error: err } = await supabase
          .from('meals')
          .select('*')
          .order('eaten_at', { ascending: false });

        if (err) throw err;
        setMeals(data || []);
      } catch (err) {
        console.error('Error fetching meals:', err);
        setError('食事記録の取得中にエラーが発生しました。');
      }
    };

    fetchMeals();
  }, [router, user]);

  const handleMealAdded = () => {
    if (!user) return;
    supabase
      .from('meals')
      .select('*')
      .order('eaten_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) {
          console.error('Error fetching meals:', err);
          return;
        }
        setMeals(data || []);
      });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この食事記録を削除してもよろしいですか？')) return;

    try {
      const { error: err } = await supabase
        .from('meals')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setMeals(meals.filter(meal => meal.id !== id));
    } catch (err) {
      console.error('Error deleting meal:', err);
      setError('食事記録の削除中にエラーが発生しました。');
    }
  };

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">食事記録</h1>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`${
                activeTab === 'list'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 font-medium`}
            >
              履歴
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`${
                activeTab === 'form'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 font-medium`}
            >
              記録
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'form' ? (
          <div className="max-w-3xl mx-auto">
            <MealForm onSuccess={handleMealAdded} />
          </div>
        ) : (
          <MealList meals={meals} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
