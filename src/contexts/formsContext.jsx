import React , { useState , useEffect } from 'react';
import { createContext } from "react";

export const formsContext = createContext();

const FormsContext = (props) => {
    // This context only deals with the Forms bundle. Individual forms may communicate with their children / subcomponents using their own contexts. ( implemented privately )
    // does 2 things. 1. is a home to the formProps ie. state 2. distributes the menu (helper functions)

    let [ formProps , setFormProps ] = useState();  
    
    useEffect( () => {
      console.log("Inside the forms context. check the current state of formProps")
      console.log(formProps);
    } , [formProps])

    // will let you edit a particular author profile.
    let authorProfile = (authorUid) => {
        setFormProps( { ...formProps , formType : "authorBioForm" , authorUid : authorUid}  )
      }
      
      let addCard = () => {
        setFormProps({ ...formProps , formType : "cardForm"})
      }
      
      // editCard action will edit a certain card. The triggering component ( usually a generic card) needs to 
      // tell the cardForm component which card its wants to edit. ie. it needs to communicate the uid of the 
      // card that needs to be edited. This is what i mean by editCardUid 
      // while calling editCard , you have to compulsarily pass it a the uid of the card that you want to edit.
      let editCard = (editCardUid) => {
        console.log(`Someone has clicked on editCard  !!! seems like someone wants to edit a card with uid ${editCardUid} `)
        setFormProps( { ...formProps , formType : "cardFormEdit" , mode : "edit" , editCardUid : editCardUid } )
      }

      let closeForm = () => {   // generic helper that closes the form by stopping it from conditionally rendering. 
          setFormProps();
      }

      // editUserUid refers to the uid of the user that needs to be edited.
      let userBioForm = (editUserUid) => {
        setFormProps( { ...formProps , formType : "userBioForm" , editUserUid : editUserUid } )
      }

      let showConfirmDelete = (cardUid) => {
        setFormProps({ ...formProps , formType : "confirmDelete" , cardUid : cardUid})
      }

      let displayTopicForm = (topicUid) => {
        setFormProps({ ...formProps , formType : "topicForm" , topicUid : topicUid});
      }

      let displayDeleteAcknowlegement = () => {
        setFormProps( {})
      }
     

    return (
        <formsContext.Provider value={ { authorProfile , showConfirmDelete , addCard, editCard , closeForm , userBioForm , formProps , setFormProps , displayTopicForm } }> 
            { props.children }
        </formsContext.Provider>
    )
}

export default FormsContext
