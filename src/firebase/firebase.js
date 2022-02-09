import { Google } from "@mui/icons-material";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider ,signInWithPopup,  onAuthStateChanged, signOut } from "firebase/auth"
import { firebaseConfig }  from "../secrets/firebaseConfig";
import { getFirestore , collection, addDoc , deleteDoc , doc , setDoc , getDoc , getDocs , query , where , updateDoc , serverTimestamp , onSnapshot  } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
import { User } from "./firestoreProductionFunctions";


  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(); // auth object. our portal to the firebase auth service
export const db = getFirestore();
export const storage = getStorage();

export const signInWithFirebase = async () => {
  try{
    const provider = new GoogleAuthProvider();
    let result = await signInWithPopup( auth , provider );  

    const credential = GoogleAuthProvider.credentialFromResult( result);
    const token = credential.accessToken;   // google OAuth token. 
    const { displayName  , email , uid  } = result.user; // signed in use info

    console.log(`${displayName} ${email} ${uid}`);

    let docSnap = await getDoc( doc( db  , "users" , uid ) );
    console.log(docSnap.data())
    if(docSnap.exists() === false){
      console.log("The user does not exist , we need to add it to firestore")
      // adding the logged in user to Firestore.
      let userObj = User({ displayName , email , uid});
      await setDoc ( doc( db , "users"   , uid )  , { userData : userObj } );
      console.log(`new user ${displayName} set to Firestore`)
    }
  }
  catch(error){
    console.log(error.message);
  }

}

export const signout = async () => {
  try{
    let user = await signOut(auth);
    console.log(user)
  }
  catch(error){
    console.log(error.message);
  }
  
}








  
