import React , { useState , createContext , useEffect } from 'react'
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {useHistory} from "react-router-dom";

export const authContext = createContext();

const AuthContext = (props) => {

    let [ loading , setLoading ] = useState(true);
    let [ user , setUser ] = useState(null);  
;
    // const history = useHistory();
    // const routeChange = (history) => {
    //     history.push("/author");
    //   }

    const history = useHistory();
    function routeChange(){
        history.push("/author");
      }
    
    // this useEffect will only run once. ie. after the first render. 
    useEffect( () => {
 
        let unsub = onAuthStateChanged( auth , (userDetails) => {
            if(userDetails){
                let { displayName , email , uid , photoURL } = userDetails; 
                console.log(`${displayName} has logged in`);
                console.log(userDetails);
                
                setUser({ displayName , email , uid , photoURL})
                routeChange();
                
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


    return (
            <authContext.Provider value ={ user } > 

                {/* if not loading, render the children , regardless of whether the user is logged in or not */}
                {/* if the user is not logged in , the ProtectRoute will automatically redirect the user to the landing page ( which has the login option) */}
                { !loading && props.children }

            </authContext.Provider>  
    )
}

export default AuthContext;
