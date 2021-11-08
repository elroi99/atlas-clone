import FirstField from "./firstField";
import SecondField from "./secondField";
import { createContext } from "react";
import {useState} from "react"
import  Box  from "@mui/material/Box";

export const controlContext  = createContext();

const Control = () => {

    let [ controlState , setControlState ] = useState();

    let updateControlState = ( name , newValue ) => {
        return () => {
            setControlState({ ...controlState , [name] : newValue })
        }
    } 

    return (
        <>
            <controlContext.Provider value={{ controlState , updateControlState }} > 
            <Box component="form">
                 <FirstField name="firstField" /> 
            </Box> 
            </controlContext.Provider>
        </>
      );
}
 
export default Control;