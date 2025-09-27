export const backendURL = '/api/'

<<<<<<< HEAD
// data/lookups.js
export const faculties = ['Экономический', 'Филологический', 'Математический']
=======

export const faculties = [
  { label: 'Экономический', value: 'eco' },
  { label: 'Филологический', value: 'phil' },
  { label: 'Математический', value: 'math' }
]
>>>>>>> 6d66a37a244d9511261e78627e8ede64e231244d

export const programs = [
  { label: 'Бакалавриат', value: 'bachelor' },
  { label: 'Магистратура', value: 'master' }
]

export const courses = [
  { label: '1 курс', value: '1' },
  { label: '2 курс', value: '2' },
  { label: '3 курс', value: '3' },
  { label: '4 курс', value: '4' }
]

<<<<<<< HEAD
export const modules = ['Основы', 'Продвинутый уровень', 'Практика']

export const TAGS = [
  { value: 'alg', label: 'Алгоритм' },
  { value: 'base', label: 'База' },
  { value: 'ml', label: 'Машинное обучение' },
  { value: 'econ', label: 'Экономика' },
  { value: 'hist', label: 'История' },
  { value: 'design', label: 'Дизайн' },
  { value: 'fin', label: 'Финансы' },
  { value: 'prog', label: 'Программирование' },
  { value: 'psy', label: 'Психология' },
  { value: 'stat', label: 'Статистика' },
  { value: 'phys', label: 'Физика' },
  { value: 'mkt', label: 'Маркетинг' },
  { value: 'gfx', label: 'Графика' },
  { value: 'bioinf', label: 'Биоинформатика' },
  { value: 'philo', label: 'Философия' },
  { value: 'math', label: 'Математика' },
  { value: 'lang', label: 'Иностранный язык' },
=======
export const modules = [
  { label: 'Основы', value: 'base' },
  { label: 'Продвинутый уровень', value: 'advanced' },
  { label: 'Практика', value: 'practice' }
]

export const tags = [
  'Экономика', 'Финансы', 'Бухгалтерия', 'История', 'Литература',
  'Лингвистика', 'Математика', 'Алгебра', 'Геометрия', 'Статистика',
  'Программирование', 'JavaScript', 'Python', 'Базы данных', 'Физика',
  'Химия', 'Биология', 'Экология', 'Право', 'Менеджмент',
  'Маркетинг', 'Логистика', 'Философия', 'Социология', 'Психология',
  'Иностранные языки', 'Китайский', 'Английский', 'Немецкий', 'Французский'
]
// если тегов будет больше, можно смело подрезать .slice(0, 30) в компоненте

// ----- список курсов -----
export const coursesList = [
  {
    id: 'eco101',
    title: 'Введение в экономику',
    tags: ['Экономика', 'Финансы', 'История'],
    faculty: 'eco',
    program: 'bachelor',
    course: '1',
    module: 'base'
  },
  {
    id: 'math201',
    title: 'Линейная алгебра',
    tags: ['Математика', 'Алгебра', 'Геометрия'],
    faculty: 'math',
    program: 'bachelor',
    course: '2',
    module: 'base'
  },
  {
    id: 'phil301',
    title: 'История философии',
    tags: ['Философия', 'История', 'Социология'],
    faculty: 'phil',
    program: 'master',
    course: '3',
    module: 'advanced'
  },
  {
    id: 'prog401',
    title: 'Современное программирование',
    tags: ['Программирование', 'Python', 'JavaScript'],
    faculty: 'math',
    program: 'master',
    course: '4',
    module: 'practice'
  },
    {
    id: 'eco4101',
    title: 'Введение в экономику',
    tags: ['Экономика', 'Финансы', 'История'],
    faculty: 'eco',
    program: 'bachelor',
    course: '1',
    module: 'base'
  },
  {
    id: 'math2401',
    title: 'Линейная алгебра',
    tags: ['Математика', 'Алгебра', 'Геометрия'],
    faculty: 'math',
    program: 'bachelor',
    course: '2',
    module: 'base'
  },
  {
    id: 'phil4301',
    title: 'История философии',
    tags: ['Философия', 'История', 'Социология'],
    faculty: 'phil',
    program: 'master',
    course: '3',
    module: 'advanced'
  },
  {
    id: 'prog4401',
    title: 'Современное программирование',
    tags: ['Программирование', 'Python', 'JavaScript'],
    faculty: 'math',
    program: 'master',
    course: '4',
    module: 'practice'
  }
>>>>>>> 6d66a37a244d9511261e78627e8ede64e231244d
]
