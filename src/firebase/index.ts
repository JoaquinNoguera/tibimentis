import  * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

import firebaseConfig from './firebase.config';

const firebaseApp = firebase.initializeApp( firebaseConfig );
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export {
    db,
    auth,
    storage,
    provider
}