import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Right from "../components/main/right.jsx"
import LeftEx from '../components/main/leftEx.jsx';
import createTheme from "@mui/material/styles/createTheme"
import Stack from "@mui/material/Stack";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add';
import Button from "@mui/material/Button";
import ModeEditOutlineTwoToneIcon from '@mui/icons-material/ModeEditOutlineTwoTone';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Forms from "../components/forms/Forms.jsx"
// import { formTriggers} from "../components/forms/Forms";
import Navbar from "../components/Navbar"
import {deleteUser} from "../firebase/firestoreFunctions";      // these functions are not used in the app. I created the file just to get he hang of firestore. 
import { db } from "../firebase/firebase";
import { collection, addDoc , deleteDoc , doc , setDoc , getDoc , getDocs , query , where , updateDoc , serverTimestamp , onSnapshot , orderBy } from "firebase/firestore"; 
import { formsContext } from "../contexts/formsContext"
// import { createUser } from "./firestoreProductionFunctions";
import { authContext } from "../contexts/authContext";
import { useEffect , useState , useContext } from "react";
// import CardDeleteAcknowlegement from "../components/forms/cardDeleteAcknowlegement";
import CardDeleteAcknowlegement from "../components/forms/cardDeleteAcknowlegement";
import { a } from "../readerView/readerView";   // just for testing. get rid of it once readerView is successfully implemented. 
import { b } from "../firebase/firestoreProductionFunctions";   // just to get firestoreProductionFunctions to run and its 
import displayPicPlaceholder from "../assets/displayPicPlaceholder.png"

let  Main = (props) => {    

    let {  userBioForm , authorProfile , deleteCard , addCard , editCard , formProps , setFormProps } = useContext(formsContext)
    let [ userData , setUserData ] = useState("");   // if the user explicitly enters a name by clicking on the edit symbol in the main page
    // displayName comes from the authContext ( the name received from firebase while authenticating the user).
      
    let [ cards , setCards ] = useState([]);   // default value -- no cards
    let { uid : userUid , displayName   } = useContext(authContext);
    let resetFormProps = () => {
    setFormProps( );    
    }
      
      useEffect( () => {

        // getting the userName , avatar and the background of the currently logged in user from Firebase. to be displayed on the top banner of the main page.
          ( async() => {
            // user doc contains all data of the user. ie. name etc, authorPool , cards , tagPool.
            let userDocData  = (await getDoc(doc(db , "users" , userUid ))).data();
            let { userName, avatar , background } = userDocData;    
            console.log("Extracted and filtered data destined for the main page");
            console.log({ userName  , avatar , background })
            setUserData({ userName  , avatar , background });
          })();
 
          console.log(`current userUid ${userUid}`);
          // getting all the cards that are to be displayed on this page. ( inside the Right component )
          let unsubscribe = onSnapshot( query( collection(db , "users" , userUid , "cards" ) , orderBy("timestamp"))  , ( querySnapshot ) => {
                      // unpack the snapshot returned by onSnapshot and set it to the state
                      let cards = querySnapshot.docs.map( ( documentSnapshot) => {
                          // Currently I havent destructured each Card doc. set the whole Card object
                          return documentSnapshot.data();
                      })
                      // cards now contains an arr of Card objects ( directly from Firebase)
                      console.log("in the Main page. Cards pulled from Firebase. View below")
                      console.log(cards);
  
                      // set the card arr to state. 
                      setCards(cards);
          })
          return ( () => {
              console.log("unsubscribing from realtime card updates before unmouting");
              unsubscribe();
          })
      } , [])

      useEffect( () => {
        console.log(cards);
      }, [ cards ])

    return (
        <> 
            <Navbar/>
            <CssBaseline />
            <Box sx={{  background: "#e96443" , 
                        background: "-webkit-linear-gradient(to bottom, #904e95, #e96443)",
                        background: "linear-gradient(to bottom, #904e95, #e96443)",
                        backgroundAttachment : "fixed",
                        minHeight : "100%"
                        }}>
            <Container maxWidth="lg" sx={{ border : "1px solid lightgrey" , backgroundColor : "#f7fafc"}}  >
                <Box> 
                    <Box sx={{ minHeight: '100vh', px : 0.1 }} >
                        <Box sx={{ pb : "1rem"}}>
                            <Box className="bannerImageContainer" sx={{ height: "200px",  width : "100%" , backgroundColor : "white", overflow : "hidden" }}>
                                     {/* img is not a MUI component. it is a HTML element. We use inline style prop on it instead of the sx prop  */}
                                     <img 
                                        src ={ userData.background }
                                        style={{ 
                                            minHeight : "auto" , 
                                            width: "100%",
                                            objectFit : "cover",
                                            objectPosition : "center"
                                         }}
                                         height="200px"
                                     /> 

                            </Box > 
                            <Box   sx={{ display:"flex", flexDirection:"row"  , height:"100px"}} >
                                    <Box className="displayPicContainer" sx={{height : "100%", flex : "0 0 200px", maxWidth : "200px" }}> 
                                        <Box 
                                            sx={{ 
                                            height : "145px" , 
                                            width : "145px" , 
                                            backgroundColor : "#ddddf34" , 
                                            borderRadius : "50%" , 
                                            position : "relative" , 
                                            left : "10%" , 
                                            bottom : "50%" , 
                                            boxShadow : "1" ,
                                            border : "2px solid white",
                                            // borderColor : "white" , 
                                            overflow : "hidden" }}
                                        >
                                            <img 
                                                // src={ displayPicPlaceholder }
                                                src={ userData.avatar ? userData.avatar : displayPicPlaceholder }
                                                // src={ userData.avatar  && userData.avatar} 
                                                style={{ height : "100%" , width: "100%", objectFit : "cover" }} 
                                            /> 

                                            {/* try using MUI avatar component instead of the stock html img component  */}
                                        </Box> 
                                    </Box>  
                                    <Box className="middleContainer" sx={{height : "100%" , flexGrow : "2" , display : "flex"}}> 
                                        <Box sx={{ alignSelf : "end" , mb: "1rem"  }}>
                                            <Box sx={{ fontWeight : "600"}} >
                                                <Stack direction="row" size="0.2rem">
                                                    <Typography sx={{ fontSize : "1.3rem" , fontWeight : "600"}}> { userData.userName ? userData.userName : displayName }  </Typography>
                                                    <ModeEditOutlineOutlinedIcon
                                                     sx = {{fontSize : "1.2rem" , ml : " 0.5rem" , position : "relative" , top : "6px" , "&:hover" : { cursor : "pointer" , color : "blue"} }}
                                                     onClick = { () => { userBioForm() } } 
                                                     />
                                                </Stack>
                                                 
                                            </Box> 
                                            {/* <Box > { should contain the userBio ( stored in firestore) deactivated for now }  </Box>  */}
                                            <Stack direction="row">
                                                <BookmarkBorderIcon/>
                                                <Typography> { cards.length } cards </Typography>
                                            </Stack> 
                                        </Box> 
                                    </Box>
                                    <Box className="rightContainer" sx={{height : "100%" , flexGrow : "1" , display : "flex"}}>
                                        <Stack direction="row" sx={{ alignSelf : "end" , mb : "1rem"}}>
                                            <Button 
                                            variant="contained" 
                                            startIcon={<AddIcon/>} 
                                            onClick = { addCard } 
                                            > 
                                                New Card 
                                            </Button>
                                        </Stack>
                                    </Box>   
                            </Box> 

                        </Box>  

                        <Grid item container xs={12} columnSpacing="2" className="secondGrid" sx={{position : "sticky", top : 0}} >
                            <Grid item xs={12} md={3} sx={{ mb : 1 }}>
                                <Paper variant="outlined" sx={{ boxShadow : 1 , height : "100%" , width : "100%"  } }> 
                                    <LeftEx/>
                                </Paper>
                            </Grid> 

                            <Grid item xs={12} md={9}>
                                <Right cardDataArr = { cards } parentPage="main" />
                            </Grid>
                        </Grid> 

                    </Box>
                </Box>
            </Container>

            { formProps &&  <Forms { ...formProps } setFormProps = {setFormProps} resetFormProps = { resetFormProps} /> }
            
            

            </Box>

            
        </>

    );
}
 
export default Main;