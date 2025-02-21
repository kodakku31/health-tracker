'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { VitalSign, VitalSignGoal } from '@/types';

interface VitalSignChartProps {
  vitalSigns: VitalSign[];
  goal?: VitalSignGoal;
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'body_temperature';
}

export default function VitalSignChart({ vitalSigns, goal, type }: VitalSignChartProps) {
  const data = useMemo(() => {
    return vitalSigns
      .sort((a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime())
      .map(sign => ({
        date: format(new Date(sign.measured_at), 'MM/dd', { locale: ja }),
        weight: sign.weight,
        systolic_bp: sign.systolic_bp,
        diastolic_bp: sign.diastolic_bp,
        heart_rate: sign.heart_rate,
        body_temperature: sign.body_temperature,
      }));
  }, [vitalSigns]);

  const renderChart = () => {
    switch (type) {
      case 'weight':
        return (
          <>
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              unit="kg"
              width={50}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3B82F6"
              name="体重"
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
            {goal?.target_weight && (
              <Line
                type="monotone"
                dataKey={() => goal.target_weight}
                stroke="#DC2626"
                strokeDasharray="5 5"
                name="目標"
                dot={false}
                isAnimationActive={false}
              />
            )}
          </>
        );

      case 'blood_pressure':
        return (
          <>
            <YAxis
              domain={['dataMin - 5', 'dataMax + 5']}
              unit="mmHg"
              width={50}
            />
            <Line
              type="monotone"
              dataKey="systolic_bp"
              stroke="#3B82F6"
              name="収縮期血圧"
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="diastolic_bp"
              stroke="#10B981"
              name="拡張期血圧"
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
            {goal?.target_systolic_bp && (
              <Line
                type="monotone"
                dataKey={() => goal.target_systolic_bp}
                stroke="#DC2626"
                strokeDasharray="5 5"
                name="目標(収縮期)"
                dot={false}
                isAnimationActive={false}
              />
            )}
            {goal?.target_diastolic_bp && (
              <Line
                type="monotone"
                dataKey={() => goal.target_diastolic_bp}
                stroke="#EF4444"
                strokeDasharray="5 5"
                name="目標(拡張期)"
                dot={false}
                isAnimationActive={false}
              />
            )}
          </>
        );

      case 'heart_rate':
        return (
          <>
            <YAxis
              domain={['dataMin - 5', 'dataMax + 5']}
              unit="bpm"
              width={50}
            />
            <Line
              type="monotone"
              dataKey="heart_rate"
              stroke="#3B82F6"
              name="心拍数"
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
            {goal?.target_heart_rate && (
              <Line
                type="monotone"
                dataKey={() => goal.target_heart_rate}
                stroke="#DC2626"
                strokeDasharray="5 5"
                name="目標"
                dot={false}
                isAnimationActive={false}
              />
            )}
          </>
        );

      case 'body_temperature':
        return (
          <>
            <YAxis
              domain={['dataMin - 0.1', 'dataMax + 0.1']}
              unit="℃"
              width={50}
            />
            <Line
              type="monotone"
              dataKey="body_temperature"
              stroke="#3B82F6"
              name="体温"
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
          </>
        );
    }
  };

  if (data.length < 2) {
    return (
      <div className="text-center text-gray-500 py-8">
        グラフを表示するには2つ以上のデータが必要です
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          {renderChart()}
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
