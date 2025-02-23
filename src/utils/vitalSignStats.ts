import type { VitalSign, VitalSignGoal } from '@/types';

interface Stats {
  current: number | null;
  min: number | null;
  max: number | null;
  avg: number | null;
  trend: 'up' | 'down' | 'stable' | null;
  goal: number | null;
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
  const periodStart = new Date(now);
  if (period === 'week') {
    periodStart.setDate(now.getDate() - 7);
  } else {
    periodStart.setMonth(now.getMonth() - 1);
  }

  const periodData = vitalSigns.filter(
    (record) => new Date(record.measured_at) >= periodStart
  );

  const calculateMetricStats = (
    getData: (record: VitalSign) => number | null,
    getGoal: (goal: VitalSignGoal | null) => number | null
  ): Stats => {
    const values = periodData
      .map(getData)
      .filter((value): value is number => value !== null);

    const goalValue = goal ? getGoal(goal) : null;

    if (values.length === 0) {
      return {
        current: null,
        min: null,
        max: null,
        avg: null,
        trend: null,
        goal: goalValue ?? null
      };
    }

    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;

    // Calculate trend using the last two values
    let trend: 'up' | 'down' | 'stable' | null = null;
    if (values.length >= 2) {
      const diff = values[0] - values[1];
      const threshold = Math.abs(values[1]) * 0.05; // 5% threshold
      if (Math.abs(diff) < threshold) {
        trend = 'stable';
      } else {
        trend = diff > 0 ? 'up' : 'down';
      }
    }

    return {
      current: values[0],
      min: Math.min(...values),
      max: Math.max(...values),
      avg,
      trend,
      goal: goalValue ?? null
    };
  };

  return {
    weight: calculateMetricStats(
      (record) => record.weight,
      (goal) => goal?.target_weight ?? null
    ),
    systolicBp: calculateMetricStats(
      (record) => record.systolic_bp,
      (goal) => goal?.target_systolic_bp ?? null
    ),
    diastolicBp: calculateMetricStats(
      (record) => record.diastolic_bp,
      (goal) => goal?.target_diastolic_bp ?? null
    ),
    heartRate: calculateMetricStats(
      (record) => record.heart_rate,
      (goal) => goal?.target_heart_rate ?? null
    ),
    bodyTemperature: calculateMetricStats(
      (record) => record.body_temperature,
      (goal) => goal?.target_body_temperature ?? null
    )
  };
};
