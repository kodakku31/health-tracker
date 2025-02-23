'use client';

import { useState } from 'react';
import { VitalSign, VitalSignGoal } from '@/types';
import { calculateStats } from '@/utils/vitalSignStats';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/solid';

interface VitalSignStatsProps {
  vitalSigns: VitalSign[];
  goal: VitalSignGoal | null;
}

export default function VitalSignStats({ vitalSigns, goal }: VitalSignStatsProps) {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const stats = calculateStats(vitalSigns, goal, period);

  const formatValue = (value: number | null, unit: string): string => {
    if (value === null) return '-';
    return `${value.toFixed(1)} ${unit}`;
  };

  const formatPercentage = (value: number | null): string => {
    if (value === null) return '-';
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable' | null) => {
    if (trend === null) return null;
    
    const iconClasses = "h-5 w-5 inline-block ml-1";
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className={`${iconClasses} text-red-500`} />;
      case 'down':
        return <ArrowDownIcon className={`${iconClasses} text-green-500`} />;
      case 'stable':
        return <MinusIcon className={`${iconClasses} text-gray-500`} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">統計情報</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'week' | 'month')}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="week">週間</option>
          <option value="month">月間</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 体重 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">体重</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">現在</span>
              <span className="font-medium">
                {formatValue(stats.weight.current, 'kg')}
                {getTrendIcon(stats.weight.trend)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">平均</span>
              <span>{formatValue(stats.weight.average, 'kg')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">最小</span>
              <span>{formatValue(stats.weight.min, 'kg')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">最大</span>
              <span>{formatValue(stats.weight.max, 'kg')}</span>
            </div>
            {stats.weight.achievementRate !== null && (
              <div className="flex justify-between">
                <span className="text-gray-500">目標達成率</span>
                <span>{formatPercentage(stats.weight.achievementRate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 血圧 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">血圧</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">現在</span>
              <span className="font-medium">
                {formatValue(stats.systolicBp.current, '')} / {formatValue(stats.diastolicBp.current, 'mmHg')}
                {getTrendIcon(stats.systolicBp.trend)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">平均</span>
              <span>
                {formatValue(stats.systolicBp.average, '')} / {formatValue(stats.diastolicBp.average, 'mmHg')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">最小</span>
              <span>
                {formatValue(stats.systolicBp.min, '')} / {formatValue(stats.diastolicBp.min, 'mmHg')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">最大</span>
              <span>
                {formatValue(stats.systolicBp.max, '')} / {formatValue(stats.diastolicBp.max, 'mmHg')}
              </span>
            </div>
            {stats.systolicBp.achievementRate !== null && (
              <div className="flex justify-between">
                <span className="text-gray-500">目標達成率</span>
                <span>{formatPercentage((stats.systolicBp.achievementRate + (stats.diastolicBp.achievementRate ?? 0)) / 2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 心拍数 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">心拍数</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">現在</span>
              <span className="font-medium">
                {formatValue(stats.heartRate.current, 'bpm')}
                {getTrendIcon(stats.heartRate.trend)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">平均</span>
              <span>{formatValue(stats.heartRate.average, 'bpm')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">最小</span>
              <span>{formatValue(stats.heartRate.min, 'bpm')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">最大</span>
              <span>{formatValue(stats.heartRate.max, 'bpm')}</span>
            </div>
            {stats.heartRate.achievementRate !== null && (
              <div className="flex justify-between">
                <span className="text-gray-500">目標達成率</span>
                <span>{formatPercentage(stats.heartRate.achievementRate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 体温 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">体温</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">現在</span>
              <span className="font-medium">
                {formatValue(stats.bodyTemperature.current, '℃')}
                {getTrendIcon(stats.bodyTemperature.trend)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">平均</span>
              <span>{formatValue(stats.bodyTemperature.average, '℃')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">最小</span>
              <span>{formatValue(stats.bodyTemperature.min, '℃')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">最大</span>
              <span>{formatValue(stats.bodyTemperature.max, '℃')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
