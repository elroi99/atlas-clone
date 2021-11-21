import Control from "./experimentalForm/control"
import {useState} from "react";
import { useEffect } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import CardForm from "./cardForm.jsx";
import Button from '@mui/material/Button';
import UserBioForm from "./userBioForm";
import ConfirmDelete from "./confirmDelete";
import AuthorBioForm from "./authorBioForm";
import { createContext } from "react";

// think of this component as a wrapper component. ie. it has multiple forms in it. when we want to use a form inside another page, 
// we embed this Form component in it. We use props to tell Form to display the forms that we want ( Form component has multiple forms in it )
// Forms has 

// open or close the drawer by calling handleDrawerOpen and handleDrawerClose methods respectively. ie. something needs to trigger these.
// chose the form that you want to be displayed inside the drawer by setting the "currentForm" state. 

// only one exception. the confirmDelete modal lives outside the drawer. ie. if triggered, it will be  displayed regardless of whether the drawer is open or closed 
// open it by changing currentForm state to "confirmDelete"

// options - cardForm , cardFormEdit , userBioForm  , authorBioForm , authorBioFormEdit , confirmDelete 

// triggers 
let editAuthorProfile = (formProps , setFormProps) => {
  console.log("Trigger pressed")
  setFormProps( { ...formProps , formType : "authorBioForm"} )
}

let deleteCard = (formProps , setFormProps) => {
  setFormProps({ ...formProps , formType : "confirmDelete"})
}

let addCard = (formProps , setFormProps) => {
  setFormProps({ ...formProps , formType : "cardForm"})
}

let editCard = (formProps , setFormProps) => {
  setFormProps( { ...formProps , formType : "cardFormEdit"})
}

export const formTriggers = { editAuthorProfile , deleteCard , addCard , editCard };  // list of form triggers

const Forms = ({formType = "" , resetFormProps  }) => {

  const [isOpen, setOpen] = useState(false);  // change this to false
  const [ currentForm , setForm] = useState();

  const handleDrawerOpen = () => {
    console.log("opening drawer")
    setOpen(true);
  };

  const handleDrawerClose = () => {
    console.log("closing drawer")
    setOpen(false);
    resetFormProps();
  };


  // this useEffect essentially changes the state based on the props that the component receives. 
  useEffect( () => {
    console.log(" Forms useEffect is running !! ")

    // if open boolean prop is part of props, open the drawer
    if(formType === "confirmDelete"){
      // confirm delete displays outside the drawer, thus, there is no need to open the drawer, unlike in the else statement. 
      setForm(formType);
    }
    else{
      console.log("opening the drawer and setting the form")
      setOpen(true);
      setForm(formType);
    }
  
  } , [])


  return( 
  <>
    <Box sx ={{ width : "100vw" , height : "100vh" , display : "flex" , flexDirection : "column" }}> 

        <Drawer
          anchor="right"
          open={isOpen}
          sx={{ width : "300px", height : "400px" , 
          // backgroundColor : "black"
        }}
        >
          <Paper sx={{ height : "100vh" }}> 

          {/* Drawer will be closed by default. When the user selects a form by clicking on 
          either button, the drawer will open and the correct form will be displayed ------ conditional rendering ofc*/}

          { currentForm === "cardForm" && <CardForm handleDrawerClose = { handleDrawerClose } mode="addCard" />  }
          { currentForm === "cardFormEdit" && <CardForm handleDrawerClose = { handleDrawerClose } mode="editCard" />  }
          { currentForm === "userBioForm" && <UserBioForm handleDrawerClose = { handleDrawerClose } />  }
          { currentForm === "userBioFormEdit" && <UserBioForm handleDrawerClose = { handleDrawerClose } mode="edit"/>  }
          { currentForm === "authorBioForm" && <AuthorBioForm handleDrawerClose = { handleDrawerClose }/>  }
        
          </Paper>
        </Drawer>
        

        { currentForm === "confirmDelete" && <ConfirmDelete/> } 


    </Box> 
  </> )
}

export default Forms;
