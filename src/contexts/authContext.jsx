import React , { useState , createContext , useEffect } from 'react'
import { auth , db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {useHistory} from "react-router-dom";
import { collection, addDoc , deleteDoc , doc , setDoc , getDoc , getDocs , query , where , updateDoc , serverTimestamp , onSnapshot } from "firebase/firestore"; 
import { User } from "../firebase/firestoreProductionFunctions"


// creating the context ( the actual meat )
export const authContext = createContext();

// careful while creating context
// youve named both, the component and the context item itself authContext
// the only difference is in the casing ie. authContext vs AuthContext
// it might be more wise to call the component AuthContextComponent

const AuthContext = (props) => {

    let [ loading , setLoading ] = useState(true);
    let [ user , setUser ] = useState();  

    const history = useHistory();
    function routeChange(){
        history.push("/main");
      }
    
    useEffect( () => {
        if(user != null){
            console.log("inside authContext useEffect , checking the login data");
            let { displayName , email , uid , photoURL } = user; 
            console.log({ displayName , email , uid , photoURL });
        }
    } , [ user ])

    
    // this useEffect will only run once. ie. after the first render. 
    useEffect( () => {
        
        let unsub = onAuthStateChanged( auth , async (userDetails) => {
            if(userDetails){
                let { displayName , email , uid , photoURL } = userDetails; 
                console.log(`${displayName} has logged in`);
                console.log(userDetails);
                
                setUser({ displayName , email , uid , photoURL});
                routeChange(); 

                // if userDetils arent  already in firestore, add them. 
                let userDetailsRef = doc(db , "users" , uid );
                if((await getDoc(userDetailsRef)).exists() === false ){
                    let userObj = User({  displayName , uid , email });
                    await setDoc(userDetailsRef , { userDetails : userObj }  );
                    console.log("User set successfully in Firestore. from authContext")
                }
            }
            else if(userDetails === null){
                console.log("setting user to null")
                setUser(null);   // when the user is not logged in, the userDetails are null
            }
 
            setLoading(false);
            
        })

        // clean-up function -- unsubscribes the onAuthStateChanged listener just before the component unmounts. 
        return () => {
            unsub();
        }

    } , [] )


    return (<authContext.Provider value = { user } > 

                {/* if not loading, render the children , regardless of whether the user is logged in or not */}
                {/* if the user is not logged in , the ProtectRoute will automatically redirect the user to the landing page ( which has the login option) */}
                { !loading && props.children }

            </authContext.Provider>  
            
    )
}

export default AuthContext;
