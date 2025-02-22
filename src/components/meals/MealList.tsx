'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Meal } from '@/types';

interface MealListProps {
  meals: Meal[];
  onDelete?: (id: string) => void;
}

const mealTypeLabels: Record<string, string> = {
  breakfast: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '間食',
};

export default function MealList({ meals, onDelete }: MealListProps) {
  return (
    <div className="space-y-6">
      {meals.map((meal) => (
        <div
          key={meal.id}
          className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                    {mealTypeLabels[meal.meal_type]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(meal.eaten_at), 'PPP p', { locale: ja })}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-medium">{meal.name}</h3>
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(meal.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  削除
                </button>
              )}
            </div>

            {meal.image_url && (
              <div className="mt-4">
                <img
                  src={meal.image_url}
                  alt={meal.name}
                  className="w-full max-w-md rounded-lg"
                />
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {meal.calories && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">カロリー</dt>
                  <dd className="mt-1">{meal.calories} kcal</dd>
                </div>
              )}
              {meal.protein && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">タンパク質</dt>
                  <dd className="mt-1">{meal.protein} g</dd>
                </div>
              )}
              {meal.fat && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">脂質</dt>
                  <dd className="mt-1">{meal.fat} g</dd>
                </div>
              )}
              {meal.carbohydrates && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">炭水化物</dt>
                  <dd className="mt-1">{meal.carbohydrates} g</dd>
                </div>
              )}
            </div>

            {meal.notes && (
              <div className="mt-4">
                <dt className="text-sm font-medium text-gray-500">メモ</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {meal.notes}
                </dd>
              </div>
            )}
          </div>
        </div>
      ))}

      {meals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">食事記録がありません</p>
        </div>
      )}
    </div>
  );
}
