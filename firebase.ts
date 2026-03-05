import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific database ID if provided
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
