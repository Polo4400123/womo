import { Exercise } from '../types';

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Жим штанги лежачи',
    category: 'Сила',
    muscle: 'Груди',
    equipment: 'Штанга',
    difficulty: 'intermediate',
    instructions: 'Ляжте на лаву, поставте ноги на підлогу. Візьміть штангу трохи ширше плечей. Зніміть штангу зі стійки та опустіть її до середини грудей. Видихніть і підніміть штангу назад у початкове положення.',
    image: 'https://images.pexels.com/photos/949126/pexels-photo-949126.jpeg',
    isFavorite: false
  },
  {
    id: '2',
    name: 'Присідання',
    category: 'Сила',
    muscle: 'Ноги',
    equipment: 'Штанга',
    difficulty: 'intermediate',
    instructions: 'Встаньте, поставивши ноги на ширині плечей. Покладіть штангу на верхню частину спини. Зігніть коліна та опустіть тіло, поки стегна не стануть паралельними підлозі. Поверніться у початкове положення.',
    image: 'https://images.pexels.com/photos/4164765/pexels-photo-4164765.jpeg',
    isFavorite: true
  },
  {
    id: '3',
    name: 'Станова тяга',
    category: 'Сила',
    muscle: 'Спина',
    equipment: 'Штанга',
    difficulty: 'advanced',
    instructions: 'Встаньте, поставивши ноги на ширині плечей. Нахиліться в стегнах і колінах, щоб взятися за штангу. Візьміть штангу на ширині плечей. Підніміть штангу, випрямляючи стегна та коліна. Опустіть штангу на підлогу, згинаючи стегна та коліна.',
    image: 'https://images.pexels.com/photos/4164755/pexels-photo-4164755.jpeg',
    isFavorite: false
  },
  {
    id: '4',
    name: 'Підтягування',
    category: 'Сила',
    muscle: 'Спина',
    equipment: 'Турнік',
    difficulty: 'intermediate',
    instructions: 'Візьміться за турнік хватом на ширині плечей. Підтягніть тіло вгору, поки підборіддя не опиниться над перекладиною. Повільно опустіться назад у початкове положення.',
    image: 'https://images.pexels.com/photos/7690215/pexels-photo-7690215.jpeg',
    isFavorite: false
  },
  {
    id: '5',
    name: 'Віджимання',
    category: 'Сила',
    muscle: 'Груди',
    equipment: 'Вага тіла',
    difficulty: 'beginner',
    instructions: 'Прийміть положення планки з руками на ширині плечей. Опустіть тіло, поки груди майже не торкнуться підлоги. Відштовхніться назад у початкове положення.',
    image: 'https://images.pexels.com/photos/4162488/pexels-photo-4162488.jpeg',
    isFavorite: true
  },
  {
    id: '6',
    name: 'Випади',
    category: 'Сила',
    muscle: 'Ноги',
    equipment: 'Вага тіла',
    difficulty: 'beginner',
    instructions: 'Встаньте, поставивши ноги на ширині стегон. Зробіть крок вперед однією ногою і опустіть тіло, поки обидва коліна не зігнуться під кутом 90 градусів. Відштовхніться назад у початкове положення.',
    image: 'https://images.pexels.com/photos/6456223/pexels-photo-6456223.jpeg',
    isFavorite: false
  }
];