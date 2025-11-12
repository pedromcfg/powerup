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

// Lista completa de exercícios organizados por categoria
const exercises = [
  // 🏋️‍♂️ Exercícios Compostos
  {
    id: 'barbell_squat',
    name: 'Agachamento com barra (Squat)',
    category: 'compound',
    categoryName: 'Exercícios Compostos',
    description: 'Exercício base que trabalha vários grupos musculares das pernas e core',
    primaryMuscles: ['Quadríceps', 'Glúteos', 'Isquiotibiais'],
    secondaryMuscles: ['Core', 'Lombares'],
    equipment: 'Barra',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  },
  {
    id: 'deadlift',
    name: 'Peso morto (Deadlift)',
    category: 'compound',
    categoryName: 'Exercícios Compostos',
    description: 'Exercício fundamental para desenvolvimento de força e massa muscular',
    primaryMuscles: ['Lombares', 'Glúteos', 'Isquiotibiais'],
    secondaryMuscles: ['Trapézio', 'Dorsais', 'Core'],
    equipment: 'Barra',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  },
  {
    id: 'bench_press',
    name: 'Supino reto (Bench Press)',
    category: 'compound',
    categoryName: 'Exercícios Compostos',
    description: 'Exercício principal para desenvolvimento do peitoral',
    primaryMuscles: ['Peitoral Maior', 'Tríceps'],
    secondaryMuscles: ['Deltóides Anteriores'],
    equipment: 'Barra',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  },
  {
    id: 'barbell_row',
    name: 'Remada com barra (Barbell Row)',
    category: 'compound',
    categoryName: 'Exercícios Compostos',
    description: 'Exercício essencial para desenvolvimento das costas',
    primaryMuscles: ['Grande Dorsal', 'Rombóides'],
    secondaryMuscles: ['Bíceps', 'Trapézio', 'Core'],
    equipment: 'Barra',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  },
  {
    id: 'overhead_press',
    name: 'Desenvolvimento de ombros com barra ou halteres (Overhead Press)',
    category: 'compound',
    categoryName: 'Exercícios Compostos',
    description: 'Exercício para desenvolvimento completo dos ombros',
    primaryMuscles: ['Deltóides', 'Tríceps'],
    secondaryMuscles: ['Core', 'Trapézio'],
    equipment: 'Barra ou Halteres',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  },
  {
    id: 'lat_pulldown',
    name: 'Puxada na frente ou barra fixa (Lat Pulldown / Pull-up)',
    category: 'compound',
    categoryName: 'Exercícios Compostos',
    description: 'Exercício para desenvolvimento dos dorsais e bíceps',
    primaryMuscles: ['Grande Dorsal', 'Bíceps'],
    secondaryMuscles: ['Rombóides', 'Trapézio'],
    equipment: 'Máquina ou Barra Fixa',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  },

  // 💪 Exercícios de Isolamento
  {
    id: 'leg_extension',
    name: 'Extensões de pernas (Leg Extension)',
    category: 'isolation',
    categoryName: 'Exercícios de Isolamento',
    description: 'Exercício isolado para quadríceps',
    primaryMuscles: ['Quadríceps'],
    secondaryMuscles: [],
    equipment: 'Máquina',
    suitableFor: ['gain_muscle', 'tone_muscle']
  },
  {
    id: 'leg_curl',
    name: 'Flexões de pernas (Leg Curl)',
    category: 'isolation',
    categoryName: 'Exercícios de Isolamento',
    description: 'Exercício isolado para isquiotibiais',
    primaryMuscles: ['Isquiotibiais'],
    secondaryMuscles: ['Glúteos'],
    equipment: 'Máquina',
    suitableFor: ['gain_muscle', 'tone_muscle']
  },
  {
    id: 'adductor_abductor',
    name: 'Cadeira adutora/abdutora',
    category: 'isolation',
    categoryName: 'Exercícios de Isolamento',
    description: 'Exercício para músculos internos e externos da coxa',
    primaryMuscles: ['Adutores', 'Abdutores'],
    secondaryMuscles: [],
    equipment: 'Máquina',
    suitableFor: ['gain_muscle', 'tone_muscle']
  },
  {
    id: 'bicep_curl',
    name: 'Bíceps com halteres ou barra (Bicep Curl)',
    category: 'isolation',
    categoryName: 'Exercícios de Isolamento',
    description: 'Exercício isolado para desenvolvimento dos bíceps',
    primaryMuscles: ['Bíceps'],
    secondaryMuscles: ['Antebraços'],
    equipment: 'Halteres ou Barra',
    suitableFor: ['gain_muscle', 'tone_muscle']
  },
  {
    id: 'triceps_pushdown',
    name: 'Tríceps na polia ou francês (Triceps Pushdown / Skull Crusher)',
    category: 'isolation',
    categoryName: 'Exercícios de Isolamento',
    description: 'Exercício isolado para desenvolvimento dos tríceps',
    primaryMuscles: ['Tríceps'],
    secondaryMuscles: [],
    equipment: 'Polia ou Halteres',
    suitableFor: ['gain_muscle', 'tone_muscle']
  },
  {
    id: 'lateral_raise',
    name: 'Elevação lateral de ombros (Lateral Raise)',
    category: 'isolation',
    categoryName: 'Exercícios de Isolamento',
    description: 'Exercício isolado para desenvolvimento dos deltóides laterais',
    primaryMuscles: ['Deltóides Laterais'],
    secondaryMuscles: [],
    equipment: 'Halteres',
    suitableFor: ['gain_muscle', 'tone_muscle']
  },
  {
    id: 'abs_crunch',
    name: 'Abdominais (crunch, elevação de pernas, prancha)',
    category: 'isolation',
    categoryName: 'Exercícios de Isolamento',
    description: 'Exercícios para fortalecimento do core e abdominais',
    primaryMuscles: ['Abdominais', 'Core'],
    secondaryMuscles: [],
    equipment: 'Nenhum',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  },

  // 🧍‍♀️ Exercícios com Peso Corporal
  {
    id: 'push_ups',
    name: 'Flexões (Push-ups)',
    category: 'bodyweight',
    categoryName: 'Exercícios com Peso Corporal',
    description: 'Exercício funcional para peitoral, tríceps e ombros',
    primaryMuscles: ['Peitoral', 'Tríceps', 'Deltóides'],
    secondaryMuscles: ['Core'],
    equipment: 'Nenhum',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'bodyweight_squat',
    name: 'Agachamentos livres',
    category: 'bodyweight',
    categoryName: 'Exercícios com Peso Corporal',
    description: 'Agachamento sem peso para desenvolvimento de pernas',
    primaryMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Core'],
    equipment: 'Nenhum',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'dips',
    name: 'Afundos (Dips)',
    category: 'bodyweight',
    categoryName: 'Exercícios com Peso Corporal',
    description: 'Exercício para tríceps e peitoral',
    primaryMuscles: ['Tríceps', 'Peitoral'],
    secondaryMuscles: ['Deltóides Anteriores'],
    equipment: 'Barras Paralelas',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'plank',
    name: 'Prancha (Plank)',
    category: 'bodyweight',
    categoryName: 'Exercícios com Peso Corporal',
    description: 'Exercício isométrico para fortalecimento do core',
    primaryMuscles: ['Core', 'Abdominais'],
    secondaryMuscles: ['Ombros', 'Glúteos'],
    equipment: 'Nenhum',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'bodyweight',
    categoryName: 'Exercícios com Peso Corporal',
    description: 'Exercício completo que combina força e cardio',
    primaryMuscles: ['Todo o corpo'],
    secondaryMuscles: [],
    equipment: 'Nenhum',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'lunges',
    name: 'Lunges (Passadas)',
    category: 'bodyweight',
    categoryName: 'Exercícios com Peso Corporal',
    description: 'Exercício unilateral para pernas e glúteos',
    primaryMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Isquiotibiais', 'Core'],
    equipment: 'Nenhum',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    category: 'bodyweight',
    categoryName: 'Exercícios com Peso Corporal',
    description: 'Exercício cardio e core intenso',
    primaryMuscles: ['Core', 'Abdominais'],
    secondaryMuscles: ['Ombros', 'Quadríceps'],
    equipment: 'Nenhum',
    suitableFor: ['lose_weight', 'tone_muscle']
  },

  // 🏃‍♂️ Cardio / Metabólicos
  {
    id: 'treadmill',
    name: 'Passadeira (trote, corrida, caminhada inclinada)',
    category: 'cardio',
    categoryName: 'Cardio / Metabólicos',
    description: 'Exercício cardiovascular essencial para perda de gordura',
    primaryMuscles: ['Pernas', 'Cardiovascular'],
    secondaryMuscles: ['Core'],
    equipment: 'Passadeira',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'stationary_bike',
    name: 'Bicicleta estática',
    category: 'cardio',
    categoryName: 'Cardio / Metabólicos',
    description: 'Cardio de baixo impacto para pernas e sistema cardiovascular',
    primaryMuscles: ['Quadríceps', 'Glúteos', 'Cardiovascular'],
    secondaryMuscles: ['Isquiotibiais'],
    equipment: 'Bicicleta Estática',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'elliptical',
    name: 'Elíptica',
    category: 'cardio',
    categoryName: 'Cardio / Metabólicos',
    description: 'Cardio de baixo impacto para todo o corpo',
    primaryMuscles: ['Pernas', 'Brazos', 'Cardiovascular'],
    secondaryMuscles: ['Core'],
    equipment: 'Elíptica',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'rowing_machine',
    name: 'Remo indoor',
    category: 'cardio',
    categoryName: 'Cardio / Metabólicos',
    description: 'Exercício completo que combina força e cardio',
    primaryMuscles: ['Costas', 'Pernas', 'Cardiovascular'],
    secondaryMuscles: ['Bíceps', 'Core'],
    equipment: 'Máquina de Remo',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'hiit',
    name: 'HIIT (sprints, circuito de peso corporal ou kettlebell)',
    category: 'cardio',
    categoryName: 'Cardio / Metabólicos',
    description: 'Treino intervalado de alta intensidade para máxima queima de gordura',
    primaryMuscles: ['Todo o corpo', 'Cardiovascular'],
    secondaryMuscles: [],
    equipment: 'Variado',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'stairs',
    name: 'Subir escadas',
    category: 'cardio',
    categoryName: 'Cardio / Metabólicos',
    description: 'Cardio intenso para pernas e sistema cardiovascular',
    primaryMuscles: ['Quadríceps', 'Glúteos', 'Cardiovascular'],
    secondaryMuscles: ['Panturrilhas'],
    equipment: 'Escadas ou Máquina',
    suitableFor: ['lose_weight', 'tone_muscle']
  },

  // ⚙️ Exercícios Funcionais / Metabólicos com Equipamento
  {
    id: 'kettlebell_swing',
    name: 'Kettlebell swing',
    category: 'functional',
    categoryName: 'Exercícios Funcionais / Metabólicos com Equipamento',
    description: 'Exercício explosivo que trabalha força e cardio',
    primaryMuscles: ['Glúteos', 'Isquiotibiais', 'Core'],
    secondaryMuscles: ['Ombros', 'Cardiovascular'],
    equipment: 'Kettlebell',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  },
  {
    id: 'battle_ropes',
    name: 'Battle ropes',
    category: 'functional',
    categoryName: 'Exercícios Funcionais / Metabólicos com Equipamento',
    description: 'Exercício de alta intensidade para força e condicionamento',
    primaryMuscles: ['Ombros', 'Core', 'Cardiovascular'],
    secondaryMuscles: ['Bíceps', 'Tríceps'],
    equipment: 'Battle Ropes',
    suitableFor: ['lose_weight', 'tone_muscle']
  },
  {
    id: 'sledgehammer',
    name: 'Sledgehammer / pneu',
    category: 'functional',
    categoryName: 'Exercícios Funcionais / Metabólicos com Equipamento',
    description: 'Exercício funcional para força e potência',
    primaryMuscles: ['Core', 'Ombros', 'Costas'],
    secondaryMuscles: ['Glúteos', 'Cardiovascular'],
    equipment: 'Sledgehammer / Pneu',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  },
  {
    id: 'step_ups',
    name: 'Step-ups com peso',
    category: 'functional',
    categoryName: 'Exercícios Funcionais / Metabólicos com Equipamento',
    description: 'Exercício unilateral para pernas e glúteos',
    primaryMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Isquiotibiais', 'Core'],
    equipment: 'Step / Halteres',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  },
  {
    id: 'sled_push',
    name: 'Puxar/empurrar trenó (Sled Push/Pull)',
    category: 'functional',
    categoryName: 'Exercícios Funcionais / Metabólicos com Equipamento',
    description: 'Exercício completo para força, potência e condicionamento',
    primaryMuscles: ['Pernas', 'Core', 'Cardiovascular'],
    secondaryMuscles: ['Ombros', 'Costas'],
    equipment: 'Trenó',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  },
  {
    id: 'farmers_walk',
    name: "Farmer's Walk (caminhada com halteres ou kettlebells)",
    category: 'functional',
    categoryName: 'Exercícios Funcionais / Metabólicos com Equipamento',
    description: 'Exercício funcional para força de pegada e core',
    primaryMuscles: ['Trapézio', 'Core', 'Antebraços'],
    secondaryMuscles: ['Glúteos', 'Isquiotibiais'],
    equipment: 'Halteres ou Kettlebells',
    suitableFor: ['lose_weight', 'gain_muscle', 'tone_muscle']
  }
];

// Função para adicionar exercícios à base de dados
async function addExercises() {
  try {
    console.log('🚀 Iniciando adição de exercícios à base de dados...');
    console.log(`📚 Total de exercícios a adicionar: ${exercises.length}\n`);

    let added = 0;
    let updated = 0;
    let errors = 0;

    for (const exercise of exercises) {
      try {
        const exerciseRef = db.collection('exercise_library').doc(exercise.id);
        const doc = await exerciseRef.get();

        if (doc.exists) {
          // Atualizar exercício existente
          await exerciseRef.update({
            ...exercise,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          console.log(`🔄 Atualizado: ${exercise.name}`);
          updated++;
        } else {
          // Criar novo exercício
          await exerciseRef.set({
            ...exercise,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          console.log(`✅ Criado: ${exercise.name}`);
          added++;
        }
      } catch (error) {
        console.error(`❌ Erro ao processar ${exercise.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n🎉 Processo concluído!');
    console.log('\n📊 Resumo:');
    console.log(`- ✅ ${added} exercícios criados`);
    console.log(`- 🔄 ${updated} exercícios atualizados`);
    if (errors > 0) {
      console.log(`- ❌ ${errors} erros`);
    }

    // Estatísticas por categoria
    const byCategory = exercises.reduce((acc, ex) => {
      acc[ex.category] = (acc[ex.category] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📈 Exercícios por categoria:');
    Object.entries(byCategory).forEach(([category, count]) => {
      const categoryName = exercises.find(e => e.category === category)?.categoryName || category;
      console.log(`  - ${categoryName}: ${count} exercícios`);
    });

  } catch (error) {
    console.error('❌ Erro ao adicionar exercícios:', error);
  } finally {
    process.exit(0);
  }
}

// Executar
addExercises();


