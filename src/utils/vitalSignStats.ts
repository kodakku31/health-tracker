import { VitalSign, VitalSignGoal } from '@/types';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface Stats {
  current: number | null;
  average: number | null;
  min: number | null;
  max: number | null;
  trend: 'up' | 'down' | 'stable' | null;
  achievementRate: number | null;
}

interface VitalSignStats {
  weight: Stats;
  systolicBp: Stats;
  diastolicBp: Stats;
  heartRate: Stats;
  bodyTemperature: Stats;
}

export const calculateStats = (
  vitalSigns: VitalSign[],
  goal: VitalSignGoal | null,
  period: 'week' | 'month' = 'week'
): VitalSignStats => {
  const now = new Date();
  const periodStart = period === 'week' ? startOfWeek(now, { weekStartsOn: 1 }) : startOfMonth(now);
  const periodEnd = period === 'week' ? endOfWeek(now, { weekStartsOn: 1 }) : endOfMonth(now);

  const periodData = vitalSigns.filter(record =>
    isWithinInterval(new Date(record.measured_at), {
      start: periodStart,
      end: periodEnd,
    })
  );

  const calculateMetricStats = (
    getData: (record: VitalSign) => number | null,
    getGoal: (goal: VitalSignGoal | null) => number | null
  ): Stats => {
    const values = periodData
      .map(getData)
      .filter((value): value is number => value !== null);

    if (values.length === 0) {
      return {
        current: null,
        average: null,
        min: null,
        max: null,
        trend: null,
        achievementRate: null,
      };
    }

    const current = values[values.length - 1];
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // トレンドの計算（最新3件の平均と前の3件の平均を比較）
    let trend: 'up' | 'down' | 'stable' | null = null;
    if (values.length >= 6) {
      const recentAvg = values.slice(-3).reduce((sum, val) => sum + val, 0) / 3;
      const previousAvg = values.slice(-6, -3).reduce((sum, val) => sum + val, 0) / 3;
      const difference = recentAvg - previousAvg;
      const threshold = average * 0.05; // 5%の変動をしきい値とする
      
      if (Math.abs(difference) < threshold) {
        trend = 'stable';
      } else {
        trend = difference > 0 ? 'up' : 'down';
      }
    }

    // 目標達成率の計算
    let achievementRate = null;
    if (goal) {
      const targetValue = getGoal(goal);
      if (targetValue !== null) {
        // 目標値に対する現在値の達成率を計算
        achievementRate = (current / targetValue) * 100;
      }
    }

    return {
      current,
      average,
      min,
      max,
      trend,
      achievementRate,
    };
  };

  return {
    weight: calculateMetricStats(
      record => record.weight,
      goal => goal?.target_weight ?? null
    ),
    systolicBp: calculateMetricStats(
      record => record.systolic_bp,
      goal => goal?.target_systolic_bp ?? null
    ),
    diastolicBp: calculateMetricStats(
      record => record.diastolic_bp,
      goal => goal?.target_diastolic_bp ?? null
    ),
    heartRate: calculateMetricStats(
      record => record.heart_rate,
      goal => goal?.target_heart_rate ?? null
    ),
    bodyTemperature: calculateMetricStats(
      record => record.body_temperature,
      () => null // 体温には目標値を設定しない
    ),
  };
};
