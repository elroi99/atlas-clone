import { Typography } from "@mui/material";
import Card from "@mui/material/Card"
import Stack from "@mui/material/Stack"
import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Icon from '@mui/material/Icon';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper"
import DeleteIcon from '@mui/icons-material/Delete';
import Container from "@mui/material/Container"
import CssBaseline from "@mui/material/CssBaseline"
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import IconButton from '@mui/material/IconButton';
import Button from "@mui/material/Button";
import { createTheme } from "@mui/material/styles"
import ButtonBase from "@mui/material/ButtonBase"
import GenericCard from "../components/main/GenericCard";
import Navbar from "../components/Navbar"
import { authContext } from "../contexts/authContext";
import { formsContext } from "../contexts/formsContext";
import { useEffect , useState , useContext } from "react";
import { collection, addDoc , deleteDoc , doc , setDoc , getDoc , getDocs , query , where , updateDoc , serverTimestamp , onSnapshot , orderBy } from "firebase/firestore"; 
import { db} from "../firebase/firebase";
import Right from "../components/main/right"
import Forms from "../components/forms/Forms.jsx"



const Queue = (props) => {

    let { authorProfile , deleteCard, addCard, editCard , closeForm , userBioForm , formProps , setFormProps  } = useContext(formsContext)
    let resetFormProps = () => {        // essentially unmounts the form + resets its form state.
        setFormProps( );
    }

    let [ cards , setCards] = useState([]);
    let { uid : userUid } = useContext(authContext);
  
    useEffect( () => {
      console.log("inside the useEffect, check the cards array out")
      console.log(cards);
      console.log("still inside the useEffect, check the uid out");
      console.log(userUid);
      let unsubscribe = onSnapshot( query( collection(db , "users" , userUid , "cards" ) , where("inQueue" , "==" , true))  , ( querySnapshot ) => {
                  // unpack the snapshot returned by onSnapshot and set it to the state
                  let cards = querySnapshot.docs.map( ( documentSnapshot) => {
                      // Currently I havent destructured each Card doc. set the whole Card object
                      return documentSnapshot.data();
                  })
                  // cards now contains an arr of Card objects ( directly from Firebase)
                  console.log("On the Queue page, pulled the cards from Firebase ( all Queue cards")
                  console.log(cards);
  
                  // set the card arr to state. 
                  setCards(cards);
      })
  
      return ( () => {
          console.log("unsubscribing from realtime card updates before unmouting");
          unsubscribe();
      })
  } , [])

  // sorting the cards locally instead of using a composite query. ( currently only in case of Queue page )
  function sortAccToTimestamp(cardsArr){
    cardsArr.sort( (firstCard , secondCard) => {
        if(firstCard.timestamp.seconds > secondCard.timestamp.seconds){
            //  second should be before first in the sorted array
            return 1;
        }
        else if( firstCard.timestamp.seconds < secondCard.timestamp.seconds){
            // first should be before second in the sorted array
            return -1;
        }else if(firstCard.timestamp.seconds === secondCard.timestamp.seconds){
            // both were made at the same time, maintain the original order ( stable sort)
            return 0;
        }
    })
  }

    let styles = {
        
    }

    return (
        <>
        <Navbar/>
        <CssBaseline/>
        <Box sx={{      background: "#e96443" , 
                        background: "-webkit-linear-gradient(to bottom, #904e95, #e96443)",
                        background: "linear-gradient(to bottom, #904e95, #e96443)",
                        pt : "2em",
                        backgroundAttachment : "fixed",
                        minHeight : "100vh"      
                        }}>

            <Container maxWidth="lg"> 
                <Right formProps={formProps} setFormProps={setFormProps} cardType={"queue"} cardDataArr ={ cards } parentPage="queue"/>
            </Container>

            { formProps &&  <Forms { ...formProps } setFormProps = {setFormProps} resetFormProps = { resetFormProps} /> }
        </Box>
        </> 

      );
}
 
export default Queue;

