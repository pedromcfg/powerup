const admin = require('firebase-admin');
const fs = require('fs');

// Carregar a chave de serviço
const serviceAccount = require('./firebase-service-account.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'powerup-a8304'
});

const db = admin.firestore();

// Workouts pré-feitos para cada objetivo
const prebuiltWorkouts = {
  hypertrophy: [
    {
      id: 'hypertrophy_abc',
      name: 'Divisão ABC para Iniciantes',
      description: 'Rotina de 3 dias para iniciantes focada em ganho de massa muscular. Dia A: Peito e Tríceps | Dia B: Costas e Bíceps | Dia C: Pernas e Ombros',
      goal: 'hypertrophy',
      difficulty: 'beginner',
      durationMinutes: 60,
      exercises: [
        {
          exerciseId: 'bench_press',
          name: 'Supino reto (Bench Press)',
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Exercício principal para peito - Dia A'
        },
        {
          exerciseId: 'inc_bench_press',
          name: 'Supino Inclinado com Halteres',
          sets: 3,
          reps: '10-12',
          restSeconds: 75,
          notes: 'Peitoral superior - Dia A'
        },
        {
          exerciseId: 'triceps_pushdown',
          name: 'Tríceps na polia (Triceps Pushdown)',
          sets: 3,
          reps: '10-12',
          restSeconds: 60,
          notes: 'Isolamento de tríceps - Dia A'
        },
        {
          exerciseId: 'barbell_row',
          name: 'Remada com barra (Barbell Row)',
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Exercício principal para costas - Dia B'
        },
        {
          exerciseId: 'lat_pulldown',
          name: 'Puxada na frente (Lat Pulldown)',
          sets: 3,
          reps: '10-12',
          restSeconds: 75,
          notes: 'Largura das costas - Dia B'
        },
        {
          exerciseId: 'bicep_curl',
          name: 'Bíceps com halteres (Bicep Curl)',
          sets: 3,
          reps: '10-12',
          restSeconds: 60,
          notes: 'Isolamento de bíceps - Dia B'
        },
        {
          exerciseId: 'barbell_squat',
          name: 'Agachamento com barra (Squat)',
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Exercício base para pernas - Dia C'
        },
        {
          exerciseId: 'leg_extension',
          name: 'Extensões de pernas (Leg Extension)',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Isolamento de quadríceps - Dia C'
        },
        {
          exerciseId: 'leg_curl',
          name: 'Flexões de pernas (Leg Curl)',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Isolamento de posteriores - Dia C'
        },
        {
          exerciseId: 'overhead_press',
          name: 'Desenvolvimento de ombros (Overhead Press)',
          sets: 3,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Ombros completos - Dia C'
        },
        {
          exerciseId: 'lateral_raise',
          name: 'Elevação lateral de ombros (Lateral Raise)',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Isolamento de ombros - Dia C'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'hypertrophy_push_pull_legs',
      name: 'Push Pull Legs (Intermediários)',
      description: 'Divisão avançada para desenvolvimento completo da musculatura',
      goal: 'hypertrophy',
      difficulty: 'intermediate',
      durationMinutes: 75,
      exercises: [
        {
          exerciseId: 'bench_press',
          name: 'Supino reto (Bench Press)',
          sets: 5,
          reps: '6-8',
          restSeconds: 120,
          notes: 'Exercício principal'
        },
        {
          exerciseId: 'inc_bench_press',
          name: 'Supino Inclinado (Halteres)',
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Peitoral superior'
        },
        {
          exerciseId: 'overhead_press',
          name: 'Desenvolvimento de ombros com barra ou halteres (Overhead Press)',
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Ombros'
        },
        {
          exerciseId: 'lateral_raise',
          name: 'Elevação lateral de ombros (Lateral Raise)',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Isolamento'
        },
        {
          exerciseId: 'triceps_pushdown',
          name: 'Tríceps na polia ou francês (Triceps Pushdown / Skull Crusher)',
          sets: 4,
          reps: '10-12',
          restSeconds: 60,
          notes: 'Isolamento completo'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'hypertrophy_full_body',
      name: 'Full Body 3x por Semana',
      description: 'Treino completo para todo o corpo, ideal para 3 sessões semanais',
      goal: 'hypertrophy',
      difficulty: 'beginner',
      durationMinutes: 70,
      exercises: [
        {
          exerciseId: 'barbell_squat',
          name: 'Agachamento com barra (Squat)',
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Exercício principal pernas'
        },
        {
          exerciseId: 'bench_press',
          name: 'Supino reto (Bench Press)',
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Peito'
        },
        {
          exerciseId: 'deadlift',
          name: 'Peso morto (Deadlift)',
          sets: 3,
          reps: '5-6',
          restSeconds: 120,
          notes: 'Força total'
        },
        {
          exerciseId: 'barbell_row',
          name: 'Remada com barra (Barbell Row)',
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Costas'
        },
        {
          exerciseId: 'overhead_press',
          name: 'Desenvolvimento de ombros com barra ou halteres (Overhead Press)',
          sets: 3,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Ombros'
        }
      ],
      isPrebuilt: true
    }
  ],
  strength: [
    {
      id: 'strength_powerlifting',
      name: 'Treino de Força Total (Powerlifting)',
      description: 'Foco nos três grandes movimentos: Agachamento, Supino e Peso Morto',
      goal: 'strength',
      difficulty: 'advanced',
      durationMinutes: 90,
      exercises: [
        {
          exerciseId: 'barbell_squat',
          name: 'Agachamento com barra (Squat)',
          sets: 5,
          reps: '3-5',
          restSeconds: 180,
          notes: 'Força máxima - 80-90% 1RM'
        },
        {
          exerciseId: 'bench_press',
          name: 'Supino reto (Bench Press)',
          sets: 5,
          reps: '3-5',
          restSeconds: 180,
          notes: 'Força máxima - 80-90% 1RM'
        },
        {
          exerciseId: 'deadlift',
          name: 'Peso morto (Deadlift)',
          sets: 5,
          reps: '3-5',
          restSeconds: 180,
          notes: 'Força máxima - 80-90% 1RM'
        },
        {
          exerciseId: 'overhead_press',
          name: 'Desenvolvimento de ombros com barra ou halteres (Overhead Press)',
          sets: 3,
          reps: '5-6',
          restSeconds: 120,
          notes: 'Acessório'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'strength_5x5',
      name: 'Rotina 5x5 (StrongLifts)',
      description: 'Programa de força progressiva com 5 séries de 5 repetições',
      goal: 'strength',
      difficulty: 'intermediate',
      durationMinutes: 60,
      exercises: [
        {
          exerciseId: 'barbell_squat',
          name: 'Agachamento com barra (Squat)',
          sets: 5,
          reps: '5',
          restSeconds: 180,
          notes: '5x5 - adicionar peso progressivamente'
        },
        {
          exerciseId: 'bench_press',
          name: 'Supino reto (Bench Press)',
          sets: 5,
          reps: '5',
          restSeconds: 180,
          notes: '5x5'
        },
        {
          exerciseId: 'barbell_row',
          name: 'Remada com barra (Barbell Row)',
          sets: 5,
          reps: '5',
          restSeconds: 180,
          notes: '5x5'
        },
        {
          exerciseId: 'overhead_press',
          name: 'Desenvolvimento de ombros com barra ou halteres (Overhead Press)',
          sets: 5,
          reps: '5',
          restSeconds: 180,
          notes: 'Alternar com supino'
        },
        {
          exerciseId: 'deadlift',
          name: 'Peso morto (Deadlift)',
          sets: 1,
          reps: '5',
          restSeconds: 180,
          notes: '1x5 - exercício final'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'strength_functional',
      name: 'Força Funcional com Peso Corporal',
      description: 'Desenvolvimento de força usando apenas o peso do corpo',
      goal: 'strength',
      difficulty: 'intermediate',
      durationMinutes: 50,
      exercises: [
        {
          exerciseId: 'bodyweight_squat',
          name: 'Agachamentos livres',
          sets: 5,
          reps: '20-30',
          restSeconds: 90,
          notes: 'Progressão para pistol squat'
        },
        {
          exerciseId: 'push_ups',
          name: 'Flexões (Push-ups)',
          sets: 5,
          reps: '15-25',
          restSeconds: 90,
          notes: 'Progressão para one-arm'
        },
        {
          exerciseId: 'dips',
          name: 'Afundos (Dips)',
          sets: 4,
          reps: '10-15',
          restSeconds: 90,
          notes: 'Força de tríceps e peito'
        },
        {
          exerciseId: 'plank',
          name: 'Prancha (Plank)',
          sets: 3,
          reps: '60-120s',
          restSeconds: 60,
          notes: 'Força isométrica do core'
        },
        {
          exerciseId: 'lat_pulldown',
          name: 'Puxada na frente ou barra fixa (Lat Pulldown / Pull-up)',
          sets: 4,
          reps: '8-12',
          restSeconds: 90,
          notes: 'Força de costas'
        }
      ],
      isPrebuilt: true
    }
  ],
  fat_loss: [
    {
      id: 'fat_loss_hiit',
      name: 'HIIT - Alta Intensidade, Curta Duração',
      description: 'Treino intervalado de alta intensidade para máxima queima de gordura',
      goal: 'fat_loss',
      difficulty: 'intermediate',
      durationMinutes: 25,
      exercises: [
        {
          exerciseId: 'hiit',
          name: 'HIIT (sprints, circuito de peso corporal ou kettlebell)',
          sets: 8,
          reps: '30s trabalho / 30s descanso',
          restSeconds: 0,
          notes: 'Máxima intensidade'
        },
        {
          exerciseId: 'burpees',
          name: 'Burpees',
          sets: 4,
          reps: '12-15',
          restSeconds: 45,
          notes: 'Exercício completo'
        },
        {
          exerciseId: 'mountain_climbers',
          name: 'Mountain Climbers',
          sets: 4,
          reps: '30s',
          restSeconds: 30,
          notes: 'Alta intensidade'
        },
        {
          exerciseId: 'kettlebell_swing',
          name: 'Kettlebell swing',
          sets: 4,
          reps: '20-25',
          restSeconds: 45,
          notes: 'Explosivo'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'fat_loss_cardio_functional',
      name: 'Cardio + Treino Funcional',
      description: 'Combinação de exercícios cardiovasculares e funcionais',
      goal: 'fat_loss',
      difficulty: 'intermediate',
      durationMinutes: 45,
      exercises: [
        {
          exerciseId: 'treadmill',
          name: 'Passadeira (trote, corrida, caminhada inclinada)',
          sets: 1,
          reps: '10 minutos',
          restSeconds: 0,
          notes: 'Aquecimento'
        },
        {
          exerciseId: 'kettlebell_swing',
          name: 'Kettlebell swing',
          sets: 4,
          reps: '15-20',
          restSeconds: 60,
          notes: 'Funcional'
        },
        {
          exerciseId: 'battle_ropes',
          name: 'Battle ropes',
          sets: 4,
          reps: '30s',
          restSeconds: 30,
          notes: 'Alta intensidade'
        },
        {
          exerciseId: 'step_ups',
          name: 'Step-ups com peso',
          sets: 3,
          reps: '15 cada perna',
          restSeconds: 60,
          notes: 'Funcional'
        },
        {
          exerciseId: 'rowing_machine',
          name: 'Remo indoor',
          sets: 1,
          reps: '5 minutos',
          restSeconds: 0,
          notes: 'Cardio final'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'fat_loss_metabolic',
      name: 'Treino Metabólico com Pesos',
      description: 'Treino com pesos em circuito para queima de gordura',
      goal: 'fat_loss',
      difficulty: 'intermediate',
      durationMinutes: 40,
      exercises: [
        {
          exerciseId: 'barbell_squat',
          name: 'Agachamento com barra (Squat)',
          sets: 3,
          reps: '15-20',
          restSeconds: 45,
          notes: 'Alto volume'
        },
        {
          exerciseId: 'bench_press',
          name: 'Supino reto (Bench Press)',
          sets: 3,
          reps: '15-20',
          restSeconds: 45,
          notes: 'Alto volume'
        },
        {
          exerciseId: 'deadlift',
          name: 'Peso morto (Deadlift)',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Metabólico'
        },
        {
          exerciseId: 'barbell_row',
          name: 'Remada com barra (Barbell Row)',
          sets: 3,
          reps: '15-20',
          restSeconds: 45,
          notes: 'Circuito'
        },
        {
          exerciseId: 'overhead_press',
          name: 'Desenvolvimento de ombros com barra ou halteres (Overhead Press)',
          sets: 3,
          reps: '12-15',
          restSeconds: 45,
          notes: 'Circuito'
        }
      ],
      isPrebuilt: true
    }
  ],
  endurance: [
    {
      id: 'endurance_cardio_progressive',
      name: 'Cardio Progressivo',
      description: 'Treino cardiovascular progressivo na esteira, bike ou rua',
      goal: 'endurance',
      difficulty: 'beginner',
      durationMinutes: 45,
      exercises: [
        {
          exerciseId: 'treadmill',
          name: 'Passadeira (trote, corrida, caminhada inclinada)',
          sets: 1,
          reps: '30 minutos progressivo',
          restSeconds: 0,
          notes: 'Aumentar intensidade gradualmente'
        },
        {
          exerciseId: 'stationary_bike',
          name: 'Bicicleta estática',
          sets: 1,
          reps: '15 minutos',
          restSeconds: 0,
          notes: 'Recuperação ativa'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'endurance_muscle_circuit',
      name: 'Circuitos de Resistência Muscular',
      description: 'Circuitos focados em resistência muscular',
      goal: 'endurance',
      difficulty: 'intermediate',
      durationMinutes: 50,
      exercises: [
        {
          exerciseId: 'bodyweight_squat',
          name: 'Agachamentos livres',
          sets: 4,
          reps: '30-40',
          restSeconds: 30,
          notes: 'Alta repetição'
        },
        {
          exerciseId: 'push_ups',
          name: 'Flexões (Push-ups)',
          sets: 4,
          reps: '25-35',
          restSeconds: 30,
          notes: 'Resistência'
        },
        {
          exerciseId: 'lunges',
          name: 'Lunges (Passadas)',
          sets: 3,
          reps: '20 cada perna',
          restSeconds: 30,
          notes: 'Circuito'
        },
        {
          exerciseId: 'plank',
          name: 'Prancha (Plank)',
          sets: 3,
          reps: '60-90s',
          restSeconds: 30,
          notes: 'Resistência isométrica'
        },
        {
          exerciseId: 'elliptical',
          name: 'Elíptica',
          sets: 1,
          reps: '10 minutos',
          restSeconds: 0,
          notes: 'Cardio final'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'endurance_interval',
      name: 'Treino Intervalado de Resistência',
      description: 'Intervalos de alta e baixa intensidade para melhorar condicionamento',
      goal: 'endurance',
      difficulty: 'intermediate',
      durationMinutes: 35,
      exercises: [
        {
          exerciseId: 'treadmill',
          name: 'Passadeira (trote, corrida, caminhada inclinada)',
          sets: 6,
          reps: '2 min rápido / 1 min lento',
          restSeconds: 0,
          notes: 'Intervalos'
        },
        {
          exerciseId: 'rowing_machine',
          name: 'Remo indoor',
          sets: 4,
          reps: '3 minutos',
          restSeconds: 60,
          notes: 'Resistência'
        },
        {
          exerciseId: 'stairs',
          name: 'Subir escadas',
          sets: 4,
          reps: '5 minutos',
          restSeconds: 60,
          notes: 'Alta intensidade'
        }
      ],
      isPrebuilt: true
    }
  ],
  mobility: [
    {
      id: 'mobility_stretching',
      name: 'Rotina de Alongamento Completo',
      description: 'Sessão completa de alongamento para todo o corpo - 30 minutos de mobilidade e flexibilidade',
      goal: 'mobility',
      difficulty: 'beginner',
      durationMinutes: 30,
      exercises: [
        {
          exerciseId: 'bodyweight_squat',
          name: 'Agachamentos livres (alongamento)',
          sets: 2,
          reps: '15-20 com pausa no fundo',
          restSeconds: 30,
          notes: 'Mobilidade de quadril e tornozelos'
        },
        {
          exerciseId: 'plank',
          name: 'Prancha (Plank)',
          sets: 3,
          reps: '45-60s',
          restSeconds: 30,
          notes: 'Mobilidade e estabilidade do core'
        },
        {
          exerciseId: 'abs_crunch',
          name: 'Alongamento de costas e core',
          sets: 1,
          reps: '10 minutos de alongamentos variados',
          restSeconds: 0,
          notes: 'Cat-cow, rotações, extensões'
        },
        {
          exerciseId: 'lunges',
          name: 'Afundos estáticos (alongamento)',
          sets: 2,
          reps: '30s cada perna',
          restSeconds: 20,
          notes: 'Mobilidade de quadril e flexores'
        },
        {
          exerciseId: 'overhead_press',
          name: 'Alongamento de ombros e peito',
          sets: 1,
          reps: '5 minutos',
          restSeconds: 0,
          notes: 'Porta, parede, alongamentos passivos'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'mobility_joint',
      name: 'Mobilidade Articular (10 min por dia)',
      description: 'Rotina rápida diária para mobilidade articular - ideal para fazer todas as manhãs',
      goal: 'mobility',
      difficulty: 'beginner',
      durationMinutes: 10,
      exercises: [
        {
          exerciseId: 'bodyweight_squat',
          name: 'Agachamentos livres (mobilidade)',
          sets: 2,
          reps: '15-20',
          restSeconds: 20,
          notes: 'Mobilidade de quadril e tornozelos'
        },
        {
          exerciseId: 'plank',
          name: 'Prancha (Plank)',
          sets: 2,
          reps: '30s',
          restSeconds: 20,
          notes: 'Ativação do core'
        },
        {
          exerciseId: 'abs_crunch',
          name: 'Rotação e alongamento de tronco',
          sets: 1,
          reps: '2 minutos',
          restSeconds: 0,
          notes: 'Mobilidade da coluna'
        },
        {
          exerciseId: 'overhead_press',
          name: 'Círculos de ombros',
          sets: 1,
          reps: '1 minuto cada direção',
          restSeconds: 0,
          notes: 'Mobilidade de ombros'
        },
        {
          exerciseId: 'lunges',
          name: 'Afundos dinâmicos',
          sets: 1,
          reps: '10 cada perna',
          restSeconds: 0,
          notes: 'Mobilidade de quadril'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'mobility_recovery',
      name: 'Treino Regenerativo Pós-Intenso',
      description: 'Sessão de recuperação ativa após treinos intensos - promove recuperação e mobilidade',
      goal: 'mobility',
      difficulty: 'beginner',
      durationMinutes: 25,
      exercises: [
        {
          exerciseId: 'elliptical',
          name: 'Elíptica (recuperação ativa)',
          sets: 1,
          reps: '10 minutos ritmo leve',
          restSeconds: 0,
          notes: 'Recuperação cardiovascular'
        },
        {
          exerciseId: 'plank',
          name: 'Prancha (Plank)',
          sets: 3,
          reps: '45s',
          restSeconds: 30,
          notes: 'Mobilidade e estabilidade'
        },
        {
          exerciseId: 'abs_crunch',
          name: 'Alongamento completo do corpo',
          sets: 1,
          reps: '10 minutos',
          restSeconds: 0,
          notes: 'Alongamentos passivos: pernas, costas, peito, ombros'
        },
        {
          exerciseId: 'bodyweight_squat',
          name: 'Agachamentos profundos (alongamento)',
          sets: 2,
          reps: '10 com pausa',
          restSeconds: 30,
          notes: 'Mobilidade de quadril'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'mobility_yoga',
      name: 'Yoga para Força e Equilíbrio',
      description: 'Sequência de yoga focada em força, equilíbrio e mobilidade',
      goal: 'mobility',
      difficulty: 'intermediate',
      durationMinutes: 40,
      exercises: [
        {
          exerciseId: 'plank',
          name: 'Prancha (Plank) e variações',
          sets: 3,
          reps: '30-60s cada',
          restSeconds: 30,
          notes: 'Plank, side plank, plank com elevação'
        },
        {
          exerciseId: 'bodyweight_squat',
          name: 'Warrior poses e agachamentos',
          sets: 2,
          reps: '5 cada lado',
          restSeconds: 20,
          notes: 'Warrior I, II, III - força e equilíbrio'
        },
        {
          exerciseId: 'abs_crunch',
          name: 'Sequência de alongamentos',
          sets: 1,
          reps: '15 minutos',
          restSeconds: 0,
          notes: 'Downward dog, cobra, criança, torções'
        },
        {
          exerciseId: 'lunges',
          name: 'Lunges e poses de equilíbrio',
          sets: 2,
          reps: '30s cada perna',
          restSeconds: 20,
          notes: 'Tree pose, half moon - equilíbrio'
        }
      ],
      isPrebuilt: true
    }
  ],
  home_workouts: [
    {
      id: 'home_full_body',
      name: 'Corpo Inteiro com Peso Corporal',
      description: 'Treino completo usando apenas o peso do corpo',
      goal: 'home_workouts',
      difficulty: 'beginner',
      durationMinutes: 40,
      exercises: [
        {
          exerciseId: 'bodyweight_squat',
          name: 'Agachamentos livres',
          sets: 4,
          reps: '20-25',
          restSeconds: 45,
          notes: 'Exercício base'
        },
        {
          exerciseId: 'push_ups',
          name: 'Flexões (Push-ups)',
          sets: 4,
          reps: '15-20',
          restSeconds: 45,
          notes: 'Peito e tríceps'
        },
        {
          exerciseId: 'lunges',
          name: 'Lunges (Passadas)',
          sets: 3,
          reps: '15 cada perna',
          restSeconds: 45,
          notes: 'Pernas'
        },
        {
          exerciseId: 'plank',
          name: 'Prancha (Plank)',
          sets: 3,
          reps: '45-60s',
          restSeconds: 30,
          notes: 'Core'
        },
        {
          exerciseId: 'burpees',
          name: 'Burpees',
          sets: 3,
          reps: '10-12',
          restSeconds: 60,
          notes: 'Exercício completo'
        },
        {
          exerciseId: 'mountain_climbers',
          name: 'Mountain Climbers',
          sets: 3,
          reps: '20-30',
          restSeconds: 45,
          notes: 'Cardio'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'home_20min',
      name: '20 Minutos por Dia (Sem Equipamentos)',
      description: 'Treino rápido e eficaz para manhãs ou pausas',
      goal: 'home_workouts',
      difficulty: 'beginner',
      durationMinutes: 20,
      exercises: [
        {
          exerciseId: 'bodyweight_squat',
          name: 'Agachamentos livres',
          sets: 3,
          reps: '20',
          restSeconds: 30,
          notes: 'Aquecimento'
        },
        {
          exerciseId: 'push_ups',
          name: 'Flexões (Push-ups)',
          sets: 3,
          reps: '15',
          restSeconds: 30,
          notes: 'Força'
        },
        {
          exerciseId: 'plank',
          name: 'Prancha (Plank)',
          sets: 3,
          reps: '30s',
          restSeconds: 30,
          notes: 'Core'
        },
        {
          exerciseId: 'burpees',
          name: 'Burpees',
          sets: 2,
          reps: '10',
          restSeconds: 45,
          notes: 'Cardio'
        },
        {
          exerciseId: 'mountain_climbers',
          name: 'Mountain Climbers',
          sets: 2,
          reps: '20',
          restSeconds: 30,
          notes: 'Final'
        }
      ],
      isPrebuilt: true
    },
    {
      id: 'home_morning',
      name: 'Rotina Rápida para Manhãs',
      description: 'Treino matinal energizante e eficiente',
      goal: 'home_workouts',
      difficulty: 'beginner',
      durationMinutes: 15,
      exercises: [
        {
          exerciseId: 'bodyweight_squat',
          name: 'Agachamentos livres',
          sets: 2,
          reps: '15',
          restSeconds: 20,
          notes: 'Energia matinal'
        },
        {
          exerciseId: 'push_ups',
          name: 'Flexões (Push-ups)',
          sets: 2,
          reps: '12',
          restSeconds: 20,
          notes: 'Força'
        },
        {
          exerciseId: 'plank',
          name: 'Prancha (Plank)',
          sets: 2,
          reps: '30s',
          restSeconds: 20,
          notes: 'Core'
        },
        {
          exerciseId: 'mountain_climbers',
          name: 'Mountain Climbers',
          sets: 2,
          reps: '15',
          restSeconds: 20,
          notes: 'Ativação'
        }
      ],
      isPrebuilt: true
    }
  ]
};

// Função para adicionar workouts pré-feitos
async function addPrebuiltWorkouts() {
  try {
    console.log('🚀 Iniciando adição de workouts pré-feitos...\n');

    let totalAdded = 0;
    const goals = Object.keys(prebuiltWorkouts);

    for (const goal of goals) {
      console.log(`📋 Processando workouts para objetivo: ${goal}`);
      const workouts = prebuiltWorkouts[goal];

      for (const workout of workouts) {
        try {
          await db.collection('prebuilt_workouts').doc(workout.id).set({
            ...workout,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          console.log(`  ✅ Criado: ${workout.name}`);
          totalAdded++;
        } catch (error) {
          console.error(`  ❌ Erro ao criar ${workout.name}:`, error.message);
        }
      }
      console.log('');
    }

    console.log('🎉 Processo concluído!');
    console.log(`\n📊 Total de workouts criados: ${totalAdded}`);
    console.log(`   - Hipertrofia: ${prebuiltWorkouts.hypertrophy.length} workouts`);
    console.log(`   - Força: ${prebuiltWorkouts.strength.length} workouts`);
    console.log(`   - Perda de Gordura: ${prebuiltWorkouts.fat_loss.length} workouts`);
    console.log(`   - Resistência: ${prebuiltWorkouts.endurance.length} workouts`);
    console.log(`   - Mobilidade: ${prebuiltWorkouts.mobility.length} workouts`);
    console.log(`   - Treinos em Casa: ${prebuiltWorkouts.home_workouts.length} workouts`);

  } catch (error) {
    console.error('❌ Erro ao adicionar workouts:', error);
  } finally {
    process.exit(0);
  }
}

// Executar
addPrebuiltWorkouts();
