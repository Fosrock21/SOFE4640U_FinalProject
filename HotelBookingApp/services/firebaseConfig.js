import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCgAfxWfGcwCblMok8zUz7nD-xJdEOF-9M",
    authDomain: "hotelbookingapp-7ab17.firebaseapp.com",
    projectId: "hotelbookingapp-7ab17",
    storageBucket: "hotelbookingapp-7ab17.firebasestorage.app",
    messagingSenderId: "762011472718",
    appId: "1:762011472718:web:176d00af124a6d4d70041f",
    measurementId: "G-H476ER89Z9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
