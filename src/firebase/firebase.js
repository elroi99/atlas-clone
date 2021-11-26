import { Google } from "@mui/icons-material";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider ,signInWithPopup,  onAuthStateChanged, signOut } from "firebase/auth"
import { firebaseConfig }  from "../secrets/firebaseConfig";

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(); // auth object. our portal to the firebase auth service
const provider = new GoogleAuthProvider();


export const signInWithFirebase = async () => {
  try{
    let result = await signInWithPopup( auth , provider );  

    const credential = GoogleAuthProvider.credentialFromResult( result);
    const token = credential.accessToken;   // google OAuth token. 
    const user = result.user; // signed in use info

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








  
