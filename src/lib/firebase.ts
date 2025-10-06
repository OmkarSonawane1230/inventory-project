import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let database: Database | null = null;

// Only initialize if we have the required config
const hasFirebaseConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

if (hasFirebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { app, auth, database, hasFirebaseConfig };
