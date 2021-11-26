import React from 'react';
import { useContext } from "react";
import { authContext } from '../contexts/authContext';

const Unauthorized = () => {

    let userData = useContext( authContext);

    return (
        <div>
            unauthorized , login to access the page you are looking for.
            {userData.uid};
        </div>
    )
}

export default Unauthorized
