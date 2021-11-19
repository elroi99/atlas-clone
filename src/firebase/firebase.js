import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"
import firebaseConfig from "../secrets/firebaseConfig";

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();


  
