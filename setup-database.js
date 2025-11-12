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

// Dados para inserir
const exerciseLibrary = [
  {
    id: 'squat',
    name: 'Agachamento (Barra)',
    group: 'Pernas',
    primary: 'Quadríceps',
    visual: 'Squat'
  },
  {
    id: 'bench_press',
    name: 'Supino Plano (Barra)',
    group: 'Peito',
    primary: 'Peitoral Maior',
    visual: 'BenchPress'
  },
  {
    id: 'deadlift',
    name: 'Peso Morto (Convencional)',
    group: 'Costas/Pernas',
    primary: 'Lombares/Glúteos',
    visual: 'Deadlift'
  },
  {
    id: 'barbell_row',
    name: 'Remada Curvada (Barra)',
    group: 'Costas',
    primary: 'Grande Dorsal',
    visual: 'BarbellRow'
  },
  {
    id: 'bicep_curl',
    name: 'Curl de Bíceps (Halteres)',
    group: 'Braços',
    primary: 'Bíceps',
    visual: 'BicepCurl'
  },
  {
    id: 'tricep_ext',
    name: 'Extensão de Tríceps Overhead',
    group: 'Braços',
    primary: 'Tríceps',
    visual: 'TricepExt'
  },
  {
    id: 'leg_press',
    name: 'Press de Pernas',
    group: 'Pernas',
    primary: 'Quadríceps/Glúteos',
    visual: 'LegPress'
  },
  {
    id: 'inc_bench_press',
    name: 'Supino Inclinado (Halteres)',
    group: 'Peito',
    primary: 'Peitoral Superior',
    visual: 'IncBenchPress'
  }
];

const professionals = [
  {
    id: 'prof1',
    name: 'Dr. Olivia Wilson',
    role: 'Consultant - Physiotherapy',
    rating: 4.9,
    reviews: 57,
    image: 'https://placehold.co/100x100/D1D1D1/000000?text=OW',
    location: 'Lisboa, Portugal',
    specialties: ['Fisioterapia', 'Reabilitação', 'Lesões Desportivas']
  },
  {
    id: 'prof2',
    name: 'Dr. Jonathan Patterson',
    role: 'Consultant - Internal Medicine',
    rating: 4.9,
    reviews: 57,
    image: 'https://placehold.co/100x100/D1D1D1/000000?text=JP',
    location: 'Porto, Portugal',
    specialties: ['Medicina Interna', 'Nutrição', 'Saúde Preventiva']
  },
  {
    id: 'prof3',
    name: 'Dr. Maria Silva',
    role: 'Personal Trainer & Nutritionist',
    rating: 4.8,
    reviews: 43,
    image: 'https://placehold.co/100x100/D1D1D1/000000?text=MS',
    location: 'Coimbra, Portugal',
    specialties: ['Personal Training', 'Nutrição', 'Perda de Peso']
  }
];

// Função para criar coleções e inserir dados
async function setupDatabase() {
  try {
    console.log('🚀 Iniciando configuração da base de dados...');

    // 1. Criar biblioteca de exercícios
    console.log('📚 Criando biblioteca de exercícios...');
    for (const exercise of exerciseLibrary) {
      await db.collection('exercise_library').doc(exercise.id).set(exercise);
      console.log(`✅ Exercício criado: ${exercise.name}`);
    }

    // 2. Criar profissionais
    console.log('👨‍⚕️ Criando profissionais...');
    for (const professional of professionals) {
      await db.collection('professionals').doc(professional.id).set(professional);
      console.log(`✅ Profissional criado: ${professional.name}`);
    }

    // 3. Criar documento de configuração da app
    console.log('⚙️ Criando configuração da app...');
    await db.collection('app_config').doc('settings').set({
      version: '1.0.0',
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      features: {
        personalRecords: true,
        workoutTracking: true,
        socialFeatures: true,
        aiChat: true
      }
    });

    // 4. Criar coleção de utilizadores com documento de exemplo
    console.log('👥 Criando coleção de utilizadores...');
    await db.collection('users').doc('example_user').set({
      uid: 'example_uid',
      name: 'Utilizador Exemplo',
      email: 'exemplo@email.com',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      note: 'Este é um documento de exemplo. Será substituído pelos utilizadores reais.'
    });

    // 5. Criar coleção de workouts com documento de exemplo
    console.log('💪 Criando coleção de workouts...');
    await db.collection('workouts').doc('example_workout').set({
      userId: 'example_uid',
      name: 'Treino Exemplo',
      date: admin.firestore.FieldValue.serverTimestamp(),
      durationSeconds: 3600,
      volume: 1000,
      note: 'Este é um documento de exemplo. Será substituído pelos treinos reais.'
    });

    console.log('🎉 Base de dados configurada com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`- ${exerciseLibrary.length} exercícios criados`);
    console.log(`- ${professionals.length} profissionais criados`);
    console.log('- Configuração da app criada');
    console.log('- Coleção de utilizadores criada');
    console.log('- Coleção de workouts criada');
    
    console.log('\n✅ Podes agora usar a aplicação!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar a base de dados:', error);
  } finally {
    process.exit(0);
  }
}

// Executar configuração
setupDatabase();
