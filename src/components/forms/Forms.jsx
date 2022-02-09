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
import { useContext } from "react";
import { formsContext } from "../../contexts/formsContext";
import  CardDeleteAcknowlegement  from "../forms/cardDeleteAcknowlegement";
import TopicForm from "../forms/topicForm";

// think of this component as a wrapper component. ie. it has multiple forms in it. when we want to use a form inside another page, 
// we embed this Form component in it. We use props to tell Form to display the forms that we want ( Form component has multiple forms in it )
// Forms has 

// open or close the drawer by calling handleDrawerOpen and handleDrawerClose methods respectively. ie. something needs to trigger these.
// chose the form that you want to be displayed inside the drawer by setting the "currentForm" state. 

// only one exception. the confirmDelete modal lives outside the drawer. ie. if triggered, it will be  displayed regardless of whether the drawer is open or closed 
// open it by changing currentForm state to "confirmDelete"

// options - cardForm , cardFormEdit , userBioForm  , authorBioForm , authorBioFormEdit , confirmDelete 

const Forms = () => {
  
  let { formProps , closeForm , editCardUid } = useContext(formsContext);
  const [isOpen, setOpen] = useState(true);  // change this to false // handles the drawer. ie internal to the form component. 

// this useOpen only opens and closes the drawer. you can handle the drawer in any way. understand the fundamentals. 
  useEffect( () => {
    if(formProps.formType === undefined){
      setOpen(false);
    }
    else{
      setOpen(true)
    }
  } , [ formProps ])

  return( 
  <>
    <Box sx ={{ width : "100vw" , height : "100vh" , display : "flex" , flexDirection : "column" }}> 

        <Drawer
          anchor="right"
          open={ isOpen }
          sx={{ width : "300px", height : "400px" , 
        }}
        >
          <Paper sx={{ height : "100vh" }}> 

          {/* Drawer will be closed by default. When the user selects a form by clicking on 
          either button, the drawer will open and the correct form will be displayed ------ conditional rendering ofc*/}

            { formProps.formType === "cardForm" && <CardForm  />  }
            { formProps.formType  === "cardFormEdit" && <CardForm  
            // mode={{ mode : "edit"}} editCardUid = { editCardUid } // is this overriding the props that we get from context ??
            />  }
            { formProps.formType  === "userBioForm" && <UserBioForm />  }
            { formProps.formType  === "authorBioForm" && <AuthorBioForm  />  }
            { formProps.formType  === "topicForm" && <TopicForm/>  }
        
          </Paper>
        </Drawer>
        

        { formProps.formType === "confirmDelete" && <ConfirmDelete /> }

        <CardDeleteAcknowlegement/>


    </Box> 
  </> )
}

export default Forms;
