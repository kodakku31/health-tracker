'use client';

import { useMemo } from 'react';
import type { Exercise } from '@/types';

interface ExerciseSummaryProps {
  exercises: Exercise[];
}

export default function ExerciseSummary({ exercises }: ExerciseSummaryProps) {
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyExercises = exercises.filter(exercise => 
      new Date(exercise.start_time) >= oneWeekAgo
    );

    return {
      totalExercises: weeklyExercises.length,
      totalCalories: weeklyExercises.reduce((sum, exercise) => sum + (exercise.calories_burned || 0), 0),
      totalMinutes: weeklyExercises.reduce((sum, exercise) => {
        const start = new Date(exercise.start_time);
        const end = new Date(exercise.end_time);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60);
      }, 0),
      byType: weeklyExercises.reduce((acc: { [key: string]: number }, exercise) => {
        acc[exercise.exercise_type] = (acc[exercise.exercise_type] || 0) + 1;
        return acc;
      }, {}),
    };
  }, [exercises]);

  const monthlyStats = useMemo(() => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const monthlyExercises = exercises.filter(exercise => 
      new Date(exercise.start_time) >= oneMonthAgo
    );

    return {
      totalExercises: monthlyExercises.length,
      totalCalories: monthlyExercises.reduce((sum, exercise) => sum + (exercise.calories_burned || 0), 0),
      totalMinutes: monthlyExercises.reduce((sum, exercise) => {
        const start = new Date(exercise.start_time);
        const end = new Date(exercise.end_time);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60);
      }, 0),
      byType: monthlyExercises.reduce((acc: { [key: string]: number }, exercise) => {
        acc[exercise.exercise_type] = (acc[exercise.exercise_type] || 0) + 1;
        return acc;
      }, {}),
    };
  }, [exercises]);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 週間サマリー */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">週間サマリー</h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">総運動回数</p>
            <p className="text-2xl font-bold">{weeklyStats.totalExercises}回</p>
          </div>
          <div>
            <p className="text-gray-600">総消費カロリー</p>
            <p className="text-2xl font-bold">{weeklyStats.totalCalories.toLocaleString()}kcal</p>
          </div>
          <div>
            <p className="text-gray-600">総運動時間</p>
            <p className="text-2xl font-bold">{Math.round(weeklyStats.totalMinutes)}分</p>
          </div>
          {Object.entries(weeklyStats.byType).length > 0 && (
            <div>
              <p className="text-gray-600 mb-2">運動種類別回数</p>
              <div className="space-y-1">
                {Object.entries(weeklyStats.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span>{getExerciseTypeLabel(type)}</span>
                    <span>{count}回</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 月間サマリー */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">月間サマリー</h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">総運動回数</p>
            <p className="text-2xl font-bold">{monthlyStats.totalExercises}回</p>
          </div>
          <div>
            <p className="text-gray-600">総消費カロリー</p>
            <p className="text-2xl font-bold">{monthlyStats.totalCalories.toLocaleString()}kcal</p>
          </div>
          <div>
            <p className="text-gray-600">総運動時間</p>
            <p className="text-2xl font-bold">{Math.round(monthlyStats.totalMinutes)}分</p>
          </div>
          {Object.entries(monthlyStats.byType).length > 0 && (
            <div>
              <p className="text-gray-600 mb-2">運動種類別回数</p>
              <div className="space-y-1">
                {Object.entries(monthlyStats.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span>{getExerciseTypeLabel(type)}</span>
                    <span>{count}回</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
