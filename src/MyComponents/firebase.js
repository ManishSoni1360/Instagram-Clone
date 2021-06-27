import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCVqmFBgIpbErOmr-jo0jDGcKNFPjAJ79k",
    authDomain: "instagram-clone-58867.firebaseapp.com",
    projectId: "instagram-clone-58867",
    storageBucket: "instagram-clone-58867.appspot.com",
    messagingSenderId: "582239050157",
    appId: "1:582239050157:web:cce4a27c1c0e8cb2e82924",
    measurementId: "G-J39QPQN6MF"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};