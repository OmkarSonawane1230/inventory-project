import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://realtime-inventory-567bc-default-rtdb.asia-southeast1.firebasedatabase.app/'
};


let app: FirebaseApp | null = null;
let database: Database | null = null;

// Only initialize if we have the required config
const hasFirebaseConfig = Boolean(firebaseConfig.databaseURL);

if (hasFirebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { app, database, hasFirebaseConfig };
