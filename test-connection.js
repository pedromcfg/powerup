const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'powerup-a8304'
});

const db = admin.firestore();

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com Firebase...');
    
    // Testar leitura de uma coleção
    const exerciseSnapshot = await db.collection('exercise_library').limit(1).get();
    
    if (exerciseSnapshot.empty) {
      console.log('⚠️  Base de dados vazia. Executa "npm run setup" primeiro.');
    } else {
      console.log('✅ Conexão com Firebase bem-sucedida!');
      console.log('📊 Coleções encontradas:');
      
      // Listar coleções
      const collections = await db.listCollections();
      collections.forEach(collection => {
        console.log(`  - ${collection.id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao conectar com Firebase:', error.message);
  } finally {
    process.exit(0);
  }
}

testConnection();
