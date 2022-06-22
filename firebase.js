import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBusIK5of84QEL4Mtd5fV79X4Uf8KvIpmE",
    authDomain: "jengcall-73f1c.firebaseapp.com",
    projectId: "jengcall-73f1c",
    storageBucket: "jengcall-73f1c.appspot.com",
    messagingSenderId: "681345778660",
    appId: "1:681345778660:web:97c91856dc32ad91affdf1"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {experimentalForceLongPolling: true});

export function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}