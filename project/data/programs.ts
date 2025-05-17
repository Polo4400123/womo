import { WorkoutProgram } from '../types';

export const programs: WorkoutProgram[] = [
  {
    id: '1',
    name: 'Програма для початківців',
    description: '4-тижнева програма, ідеальна для початківців, які хочуть набрати силу та м\'язову масу.',
    level: 'beginner',
    duration: '4 тижні',
    days: [
      {
        id: 'd1',
        name: 'День 1: Все тіло',
        exercises: [
          { exerciseId: '5', sets: 3, reps: 10, rest: 60 },
          { exerciseId: '6', sets: 3, reps: 10, rest: 60 },
          { exerciseId: '2', sets: 3, reps: 8, rest: 90 }
        ]
      },
      {
        id: 'd2',
        name: 'День 2: Відпочинок',
        exercises: []
      },
      {
        id: 'd3',
        name: 'День 3: Верхня частина тіла',
        exercises: [
          { exerciseId: '1', sets: 3, reps: 8, rest: 90 },
          { exerciseId: '5', sets: 3, reps: 10, rest: 60 },
          { exerciseId: '4', sets: 3, reps: 8, rest: 90 }
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg',
    isFavorite: true
  },
  {
    id: '2',
    name: 'Програма гіпертрофії',
    description: '8-тижнева програма, розроблена для максимального росту м\'язів з прогресивним навантаженням.',
    level: 'intermediate',
    duration: '8 тижнів',
    days: [
      {
        id: 'd1',
        name: 'День 1: Груди та трицепс',
        exercises: [
          { exerciseId: '1', sets: 4, reps: 8, rest: 90 },
          { exerciseId: '5', sets: 3, reps: 12, rest: 60 }
        ]
      },
      {
        id: 'd2',
        name: 'День 2: Спина та біцепс',
        exercises: [
          { exerciseId: '3', sets: 4, reps: 6, rest: 120 },
          { exerciseId: '4', sets: 3, reps: 10, rest: 90 }
        ]
      },
      {
        id: 'd3',
        name: 'День 3: Ноги',
        exercises: [
          { exerciseId: '2', sets: 4, reps: 8, rest: 120 },
          { exerciseId: '6', sets: 3, reps: 12, rest: 60 }
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/6551133/pexels-photo-6551133.jpeg',
    isFavorite: false
  },
  {
    id: '3',
    name: 'Програма сили та потужності',
    description: 'Складна 12-тижнева програма для досвідчених атлетів, спрямована на розвиток сили та потужності.',
    level: 'advanced',
    duration: '12 тижнів',
    days: [
      {
        id: 'd1',
        name: 'День 1: Присідання',
        exercises: [
          { exerciseId: '2', sets: 5, reps: 5, rest: 180 },
          { exerciseId: '6', sets: 3, reps: 10, rest: 90 }
        ]
      },
      {
        id: 'd2',
        name: 'День 2: Жим',
        exercises: [
          { exerciseId: '1', sets: 5, reps: 5, rest: 180 },
          { exerciseId: '5', sets: 3, reps: 15, rest: 60 }
        ]
      },
      {
        id: 'd3',
        name: 'День 3: Станова тяга',
        exercises: [
          { exerciseId: '3', sets: 5, reps: 3, rest: 210 },
          { exerciseId: '4', sets: 3, reps: 8, rest: 120 }
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/2204196/pexels-photo-2204196.jpeg',
    isFavorite: false
  }
];