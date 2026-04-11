import { collection, doc } from 'firebase/firestore';
import { db } from './firebase';

export const usersCollection = collection(db, 'users');
export const userDoc = (uid: string) => doc(db, 'users', uid);