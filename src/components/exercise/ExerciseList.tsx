import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Exercise } from '@/types';

interface ExerciseListProps {
  exercises: Exercise[];
}

export default function ExerciseList({ exercises }: ExerciseListProps) {
  if (!exercises.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">運動記録がありません</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600">
                    {exercise.exerciseType}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {format(new Date(exercise.startTime), 'p')} - {format(new Date(exercise.endTime), 'p')} / {exercise.caloriesBurned} kcal
                  </p>
                  {exercise.notes && (
                    <p className="mt-1 text-sm text-gray-500">
                      メモ: {exercise.notes}
                    </p>
                  )}
                </div>
                <div className="ml-2 flex flex-shrink-0">
                  <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                    {format(new Date(exercise.startTime), 'PPP', { locale: ja })}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
