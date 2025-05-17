export type Exercise = {
  id: string;
  name: string;
  category: string;
  muscle: string;
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string;
  image: string;
  isFavorite?: boolean;
};

export type Meal = {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string[];
  image: string;
  isFavorite?: boolean;
};

export type WorkoutProgram = {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  days: WorkoutDay[];
  image: string;
  isFavorite?: boolean;
};

export type WorkoutDay = {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
};

export type WorkoutExercise = {
  exerciseId: string;
  sets: number;
  reps: number;
  rest: number;
};

export type NutritionPlan = {
  id: string;
  name: string;
  description: string;
  meals: Meal[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image: string;
};

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'low' | 'medium' | 'high';
  image?: string;
};

export type ProgressData = {
  date: string;
  weight: number;
  calories: number;
  workouts: number;
};