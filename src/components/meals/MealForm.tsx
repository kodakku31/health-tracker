'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { MealType } from '@/types';

interface MealFormProps {
  onSuccess?: () => void;
}

export default function MealForm({ onSuccess }: MealFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [eatenAt, setEatenAt] = useState(new Date().toISOString().slice(0, 16));
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbohydrates, setCarbohydrates] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;

      // 画像がある場合はアップロード
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('meal-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('meal-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('meals')
        .insert({
          user_id: user.id,
          meal_type: mealType,
          eaten_at: new Date(eatenAt).toISOString(),
          name,
          calories: calories ? parseInt(calories) : null,
          protein: protein ? parseFloat(protein) : null,
          fat: fat ? parseFloat(fat) : null,
          carbohydrates: carbohydrates ? parseFloat(carbohydrates) : null,
          notes: notes || null,
          image_url: imageUrl,
        });

      if (insertError) throw insertError;

      // フォームをリセット
      setMealType('breakfast');
      setEatenAt(new Date().toISOString().slice(0, 16));
      setName('');
      setCalories('');
      setProtein('');
      setFat('');
      setCarbohydrates('');
      setNotes('');
      setImage(null);

      onSuccess?.();
    } catch (err) {
      console.error('Error adding meal:', err);
      setError('食事記録の追加中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="meal-type" className="block text-sm font-medium text-gray-700">
            食事の種類
          </label>
          <select
            id="meal-type"
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="breakfast">朝食</option>
            <option value="lunch">昼食</option>
            <option value="dinner">夕食</option>
            <option value="snack">間食</option>
          </select>
        </div>

        <div>
          <label htmlFor="eaten-at" className="block text-sm font-medium text-gray-700">
            食事日時
          </label>
          <input
            type="datetime-local"
            id="eaten-at"
            value={eatenAt}
            onChange={(e) => setEatenAt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            食事内容
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
            カロリー (kcal)
          </label>
          <input
            type="number"
            id="calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            min="0"
            step="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="protein" className="block text-sm font-medium text-gray-700">
            タンパク質 (g)
          </label>
          <input
            type="number"
            id="protein"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            min="0"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="fat" className="block text-sm font-medium text-gray-700">
            脂質 (g)
          </label>
          <input
            type="number"
            id="fat"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            min="0"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="carbohydrates" className="block text-sm font-medium text-gray-700">
            炭水化物 (g)
          </label>
          <input
            type="number"
            id="carbohydrates"
            value={carbohydrates}
            onChange={(e) => setCarbohydrates(e.target.value)}
            min="0"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            写真
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            メモ
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? '保存中...' : '保存する'}
        </button>
      </div>
    </form>
  );
}
