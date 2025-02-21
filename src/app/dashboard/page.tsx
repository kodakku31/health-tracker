'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
      
      {/* プロフィール情報 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">プロフィール情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">表示名</p>
            <p className="font-medium">{profile?.display_name}</p>
          </div>
          <div>
            <p className="text-gray-600">メールアドレス</p>
            <p className="font-medium">{profile?.email}</p>
          </div>
          <div>
            <p className="text-gray-600">生年月日</p>
            <p className="font-medium">{profile?.birth_date}</p>
          </div>
          <div>
            <p className="text-gray-600">性別</p>
            <p className="font-medium">
              {profile?.gender === 'male' ? '男性' :
               profile?.gender === 'female' ? '女性' : 'その他'}
            </p>
          </div>
          <div>
            <p className="text-gray-600">身長</p>
            <p className="font-medium">{profile?.height} cm</p>
          </div>
          <div>
            <p className="text-gray-600">活動レベル</p>
            <p className="font-medium">
              {profile?.activity_level === 'sedentary' ? '座り仕事が多い' :
               profile?.activity_level === 'lightly_active' ? '軽い運動をする' :
               profile?.activity_level === 'moderately_active' ? '中程度の運動をする' :
               profile?.activity_level === 'very_active' ? '激しい運動をする' :
               profile?.activity_level === 'extra_active' ? '非常に激しい運動をする' : '不明'}
            </p>
          </div>
        </div>
      </div>

      {/* 基礎代謝と消費カロリー */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">基礎代謝</h2>
          <p className="text-3xl font-bold text-indigo-600">
            {calculateBMR(profile)} kcal/日
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">1日の推定消費カロリー</h2>
          <p className="text-3xl font-bold text-indigo-600">
            {calculateTDEE(profile)} kcal/日
          </p>
        </div>
      </div>

      {/* 体重記録フォーム（後で実装） */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">体重を記録</h2>
        <p className="text-gray-600">体重記録機能は準備中です...</p>
      </div>
    </div>
  );
}

// 基礎代謝（BMR）を計算する関数
function calculateBMR(profile: UserProfile | null): number {
  if (!profile) return 0;

  const age = calculateAge(profile.birth_date);
  const height = profile.height;
  
  // ハリス・ベネディクト方程式を使用
  if (profile.gender === 'male') {
    return Math.round(13.397 * 65 + 4.799 * height - 5.677 * age + 88.362);
  } else {
    return Math.round(9.247 * 65 + 3.098 * height - 4.330 * age + 447.593);
  }
}

// 1日の総消費カロリー（TDEE）を計算する関数
function calculateTDEE(profile: UserProfile | null): number {
  if (!profile) return 0;

  const bmr = calculateBMR(profile);
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };

  const multiplier = activityMultipliers[profile.activity_level] || 1.2;
  return Math.round(bmr * multiplier);
}

// 年齢を計算する関数
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}
