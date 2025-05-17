import { UserProfile, ProgressData } from '../types';

export const userProfile: UserProfile = {
  id: '1',
  name: 'Alex',
  age: 28,
  weight: 75,
  height: 178,
  goal: 'gain',
  activityLevel: 'medium'
};

export const progressData: ProgressData[] = [
  { date: '2025-03-01', weight: 74, calories: 2200, workouts: 3 },
  { date: '2025-03-08', weight: 74.5, calories: 2300, workouts: 4 },
  { date: '2025-03-15', weight: 75, calories: 2350, workouts: 4 },
  { date: '2025-03-22', weight: 75.2, calories: 2400, workouts: 5 },
  { date: '2025-03-29', weight: 75.5, calories: 2450, workouts: 5 },
  { date: '2025-04-05', weight: 76, calories: 2500, workouts: 5 }
];