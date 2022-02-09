import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack"
import Chip from "@mui/material/Chip"
import { Link} from "react-router-dom"
import Author from "../Pages/author"
import CardForm from "./forms/cardForm";
import AuthorForm from "./forms/Forms";
import Topic from "../Pages/author";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import IconButton from '@mui/material/IconButton';
import { Button , Paper } from "@mui/material";
import { useState } from "react";
import Landing from "../Pages/landing";
import { signout , auth } from "../firebase/firebase";
import { authContext }  from "../contexts/authContext";
import { useContext , useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDocs , doc , collection , query , where , setDoc , onSnapshot , orderBy } from "firebase/firestore"
import { db } from "../firebase/firebase"; 
import Fade from '@mui/material/Fade';
import ClickAwayListener from '@mui/material/ClickAwayListener';

let Navbar = (props) => {
  // my understanding, if this component has rendered, it means that the user is logged in..... thus i've set the default 
  // loginState to true. when the user clicks the logout button, I will redirect out to the landing page. ie. logged out. 

  const [ loginState , changeLoginState] = useState(true);
  const [ queueCardCount , setQueueCardCount ] = useState();
  const [ logoutBtnVisibility , changeLogoutBtnVisibility] = useState(false);

  function toggleLogoutBtnVisibility(){
    logoutBtnVisibility === true ? changeLogoutBtnVisibility(false) : changeLogoutBtnVisibility(true);
  }

  let { uid : userUid } = useContext(authContext);

  let handleLoginClick = () => {
    ( loginState === false ) ? changeLoginState(true) :  changeLoginState(false);
    signout(); 
    console.log("Signed out using navbar");
  }

  // get the number of cards that are in the queue.
  useEffect( () => {
    let unsubscribe = onSnapshot( query( collection(db , "users" , userUid , "cards" ) , where("inQueue" , "==" , true )) , (snapshot) => {
        setQueueCardCount(snapshot.docs.length);
    })

    return ( () => { unsubscribe() } )
  } , [])

  // let navItems = [ { title : "Profile" , link : "/main" },
  //                   { title : "Queue" , link : "/queue" },
  //                   { title : "Explore" , link : "/explore" },
  //                   { title : "Author" , link : "/author" },
  //                   { title : "Landing" , link : "/" }, ]


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0}  sx={{ backgroundColor : "#FFFFFF" , textColor : "black" , padding : "0px" ,   }}>

        <Toolbar sx={{display : "flex" , justifyContent : "center", height : "100%" , disableGutters : 'true' , position: "relative" }}>

          <Stack direction="row" justifyContent="center" spacing={10} sx={{ height : "100%"  }} > 
            
              <Typography variant="h6" component="div" sx={ { flexGrow : "1"  }}  >
                <Link to="/main" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"}}}>
                  All Cards
                  </Link>
              </Typography>
            
            <Stack direction="row" sx={{ color : "#a4b1c3" }}> 
                <Typography variant="h6" component="div" sx={{ flexGrow : "1" }}>
                    <Link to="/queue" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"} }} > 
                      Queue
                    </Link>
                </Typography>

                {/* render the queue card counter chip only if / once we know how many they are */}
                { queueCardCount > 0 && <Chip label={ queueCardCount } size="small" sx={{ position : "relative" , top : "5px" , ml : "0.2rem" , color : "red" , backgroundColor : "#ffbcb8"}} />  }
                
            </Stack>

            <Typography variant="h6" component="div" sx={{ flexGrow : "1" }}>
                    <Link to="/explore" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"} }} > 
                      Explore
                    </Link>
            </Typography>

            {/* The Author page should not be accessible through the Navbar.It is a param page.
             it can only access when the user presses on an author in the explore section  */}
            {/* <Typography variant="h6" component="div" sx={{ flexGrow : "1" }}>
                    <Link to="/author" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"} }} > 
                      Author
                    </Link>
            </Typography> */}

            {/* <Typography variant="h6" component="div" sx={{ flexGrow : "1" }}>
                    <Link to="/demoPage" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"} }} > 
                      Demo Page
                    </Link>
            </Typography> */}

            {/* The Landing page should not be accessible through the Navbar. thus commenting it */}
            {/* <Typography variant="h6" component="div" sx={{ flexGrow : "1" }}>
                    <Link to="/" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"} }} > 
                      Landing
                    </Link>
            </Typography> */}

            {/* <Typography variant="h6" component="div" sx={{ flexGrow : "1" }}>
                    <Link to="/topic" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"} }} > 
                      Topic
                    </Link>
            </Typography> */}

            {/* this iconbutton is pushing the topbar links for some reason */}
            <ClickAwayListener onClickAway={ () => { changeLogoutBtnVisibility(false) } }>
            <IconButton onClick ={ toggleLogoutBtnVisibility } sx ={{ position : "absolute" , right : "3rem" , bottom : "12px" }}> 
              { 
                loginState === true 
                ?
                <AccountCircleIcon/> 
                : 
                null
              }

              <>
              
                <Fade in={ logoutBtnVisibility }>
                  {/* <ClickAwayListener > */}
                  <Box sx={{ border : "1px solid #AE5579" , borderRadius : "5px" , position: "absolute"  , top : "75%" , boxShadow : 2 , height : "auto" , width : "auto"}}> 
                    
                      <Paper sx={{ py : 0.5 , px  : 1 , backgroundColor : "#EDF2F7" }}>
                        <Button 
                        sx={{ color : "#AE5579" , fontWeight : "600"}}
                        onClick={ handleLoginClick }
                        > Logout </Button> 
                      </Paper> 
                    
                  </Box>
                  {/* </ClickAwayListener> */}
                </Fade>

              </>

            </IconButton>
            </ClickAwayListener>

            

            
          </Stack>

        </Toolbar>

      </AppBar>
    </Box>
  );
}


export default Navbar;

