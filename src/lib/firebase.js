// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCk24f5_OFmFFn3l6k1CVex9JNF5Zd6ywM",
  authDomain: "chunking-aa5c9.firebaseapp.com",
  projectId: "chunking-aa5c9",
  storageBucket: "chunking-aa5c9.firebasestorage.app",
  messagingSenderId: "61089544199",
  appId: "1:61089544199:web:f7e179cd5957828e6892a2",
  measurementId: "G-ECX92HNB5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};