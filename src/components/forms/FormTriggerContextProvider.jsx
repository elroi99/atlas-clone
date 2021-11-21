import React from 'react'
import { formTriggers } from "./Forms";
import { createContext } from 'react';

let formsTriggersContext = createContext();

const FormTriggerContextProvider = (props) => {

    let { editAuthorProfile , deleteCard , addCard , editCard } = formTriggers;
    
    return (
        <formsTriggersContext.Provider value={ { editAuthorProfile , deleteCard , addCard , editCard }  }> 
            {props.children}
        </formsTriggersContext.Provider>
    )
}

export default FormTriggerContextProvider
export { formsTriggersContext}