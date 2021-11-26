import React from 'react'
import { Route} from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../contexts/authContext";
import { Redirect } from "react-router-dom";

const ProtectedRoute = ({ component : Component ,  ...rest }) => {


    let data = useContext(authContext);
    return(
        <>

        {
            <Route {...rest} render={
                (routeProps) => {
                    if(data){
                         return  <Component {...rest} {...routeProps}/>
                    }
                     else{
                         return <Redirect to="/"/> 
                     }
                }
            }/> 
        }

        </>
    )
}

export default ProtectedRoute;
