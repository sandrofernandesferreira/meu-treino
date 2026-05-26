import AsyncStorage from '@react-native-async-storage/async-storage';

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const seedPlans = [
  {
    id: generateId(),
    name: 'Treino de Hipertrofia - 4x Semana',
    division: 'ABCD',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    trainingSchedule: {
      monday: 'A',
      tuesday: 'B',
      wednesday: 'off',
      thursday: 'C',
      friday: 'D',
      saturday: 'off',
      sunday: 'off',
    },
    createdAt: new Date().toISOString(),
  },
];

const seedWorkouts = [
  {
    id: generateId(),
    trainingPlanId: seedPlans[0].id,
    letter: 'A',
    name: 'Peito + Tríceps',
    exercises: [
      {
        id: generateId(),
        name: 'Supino Reto',
        series: 4,
        reps: 10,
        weight: 40,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Supino Inclinado',
        series: 3,
        reps: 10,
        weight: 35,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Crucifixo',
        series: 3,
        reps: 12,
        weight: 20,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Tríceps Corda',
        series: 3,
        reps: 12,
        weight: 30,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Tríceps Testa',
        series: 3,
        reps: 10,
        weight: 25,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Mergulho',
        series: 3,
        reps: 8,
        weight: 0,
        imageUrl: '',
      },
    ],
    notes: 'Progressão de carga importante. Descanso 60-90s entre séries.',
  },
  {
    id: generateId(),
    trainingPlanId: seedPlans[0].id,
    letter: 'B',
    name: 'Costas + Bíceps',
    exercises: [
      {
        id: generateId(),
        name: 'Puxada Frente',
        series: 4,
        reps: 10,
        weight: 50,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Remada Curvada',
        series: 3,
        reps: 10,
        weight: 45,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Remada Baixa',
        series: 3,
        reps: 11,
        weight: 50,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Rosca Direta',
        series: 3,
        reps: 10,
        weight: 25,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Rosca Alternada',
        series: 3,
        reps: 11,
        weight: 20,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Rosca Concentrada',
        series: 2,
        reps: 13,
        weight: 15,
        imageUrl: '',
      },
    ],
    notes: 'Manter postura correta. Focar na contração das costas.',
  },
  {
    id: generateId(),
    trainingPlanId: seedPlans[0].id,
    letter: 'C',
    name: 'Pernas (Completo)',
    exercises: [
      {
        id: generateId(),
        name: 'Agachamento Livre',
        series: 4,
        reps: 8,
        weight: 60,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Leg Press',
        series: 3,
        reps: 11,
        weight: 80,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Cadeira Extensora',
        series: 3,
        reps: 13,
        weight: 40,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Mesa Flexora',
        series: 3,
        reps: 11,
        weight: 40,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Panturrilha',
        series: 4,
        reps: 15,
        weight: 50,
        imageUrl: '',
      },
    ],
    notes: 'Cuidado com a postura. Dia intenso! Hidratar bem.',
  },
  {
    id: generateId(),
    trainingPlanId: seedPlans[0].id,
    letter: 'D',
    name: 'Ombros + Abdômen',
    exercises: [
      {
        id: generateId(),
        name: 'Desenvolvimento',
        series: 4,
        reps: 10,
        weight: 25,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Elevação Lateral',
        series: 3,
        reps: 13,
        weight: 12,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Elevação Frontal',
        series: 3,
        reps: 11,
        weight: 12,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Posterior',
        series: 3,
        reps: 13,
        weight: 12,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Crunch',
        series: 3,
        reps: 18,
        weight: 0,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Elevação de Pernas',
        series: 3,
        reps: 13,
        weight: 0,
        imageUrl: '',
      },
      {
        id: generateId(),
        name: 'Prancha',
        series: 3,
        reps: 45,
        weight: 0,
        imageUrl: '',
      },
    ],
    notes: 'Execução correta acima de tudo. Ombros são articulações sensíveis.',
  },
];

export async function initializeSeedData() {
  try {
    const isInitialized = await AsyncStorage.getItem('dataInitialized');

    if (!isInitialized) {
      await AsyncStorage.setItem('trainingPlans', JSON.stringify(seedPlans));
      await AsyncStorage.setItem('workouts', JSON.stringify(seedWorkouts));
      await AsyncStorage.setItem('sessions', JSON.stringify([]));
      await AsyncStorage.setItem('currentPlanId', seedPlans[0].id);
      await AsyncStorage.setItem('dataInitialized', 'true');
      console.log('✓ Dados seed inicializados');
    }
  } catch (error) {
    console.error('Erro ao inicializar dados seed:', error);
  }
}
