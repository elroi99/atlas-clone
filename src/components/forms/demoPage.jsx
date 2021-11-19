import Control from "./experimentalForm/control"
import {useState} from "react";
import { useEffect } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import CardForm from "./cardForm.jsx"
import Button from '@mui/material/Button';
import UserBioForm from "./userBioForm";


const DemoPage = () => {

  const [open, setOpen] = useState(false);  // change this to false
  const [ currentForm , setForm] = useState();

  const handleDrawerOpen = () => {
    console.log("opening drawer")
    setOpen(true);
  };

  const handleDrawerClose = () => {
    console.log("closing drawer")
    setOpen(false);
  };
  return( 
  <>
    <Box sx ={{ width : "100vw" , height : "100vh" , display : "flex" , flexDirection : "column" }}> 

      <Box className="trigger buttons" sx ={{ position : "relative" , top : "300px" }}> 
          <Button 
          variant="contained" 
          formName = "cardForm"
          onClick = { (e) => { handleDrawerOpen() ; setForm("cardForm") }}
          sx={{ display : "block"}}
          >
          Cards Form (add new card)
          </Button> 

          <Button 
          variant="contained" 
          formName = "cardForm"
          onClick = { (e) => { handleDrawerOpen() ; setForm("cardFormEdit")  }}
          sx={{ display : "block"}}
          >
          Card Form Edit Mode (Edit existing card)
          </Button> 

          {/* button to trigger user bio form */}
          <Button 
          variant="contained"
          formName = "userBio" 
          sx={{ display : "block"}}
          onClick = { (e) => { handleDrawerOpen() ;  setForm("userBio") }}> 
          User Bio Form
          </Button>  
      </Box>
      
        <Drawer
          anchor="right"
          open={open}
          sx={{ width : "300px", height : "400px" , 
          // backgroundColor : "black"
        }}
        >
          <Paper sx={{ height : "100vh" }}> 

          {/* Drawer will be closed by default. When the user selects a form by clicking on 
          either button, the drawer will open and the correct form will be displayed ------ conditional rendering ofc*/}

          { currentForm === "cardForm" && <CardForm handleDrawerClose = { handleDrawerClose } mode="addCard" />  }
          { currentForm === "cardFormEdit" && <CardForm handleDrawerClose = { handleDrawerClose } mode="editCard" />  }
          { currentForm === "userBio" && <UserBioForm handleDrawerClose = { handleDrawerClose } />  }

          </Paper>
        </Drawer> 

    </Box> 
  </> )
}

export default DemoPage;
