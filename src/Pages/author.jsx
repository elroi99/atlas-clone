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
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import ModeEditOutlineTwoToneIcon from '@mui/icons-material/ModeEditOutlineTwoTone';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Image from "../assets/author-background.jpg"
import Forms from "../components/forms/Forms.jsx"
import { useState , useEffect , useContext } from "react";
// import { formTriggers} from "../components/forms/Forms";
import Navbar from "../components/Navbar";
import { formsContext } from "../contexts/formsContext"
import { editAuthorProfile } from "../components/forms/Forms";
import { getDocs , doc , collection , query , where , setDoc , onSnapshot , orderBy , deleteDoc , updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"; 
// import { createUser } from "./firestoreProductionFunctions";
import { authContext } from "../contexts/authContext";
import { useParams } from "react-router-dom";
import displayPicPlaceholder from "../assets/displayPicPlaceholder.png";


let  Author = (props) => {

// formType options -- cardForm , cardFormEdit , userBioForm , userBioFormEdit , authorBioForm , confirmDelete ,  (choses the form to be displayed within the drawer)

let { authorProfile , deleteCard, addCard, editCard , closeForm , userBioForm , formProps , setFormProps  } = useContext(formsContext)
let resetFormProps = () => {        // essentially unmounts the form + resets its form state.
    setFormProps( );
  }

let [ cards , setCards] = useState([]);
let [ authorBioDetails , setAuthorBioDetails ] = useState({ name : "" , bio : "" , avatar : "" , website : "" , twitter : "" , background : "" })
let { uid : userUid } = useContext(authContext);
let { authorUid } = useParams();   // to catch the url param.
console.log(`viewing cards of author with uid ${authorUid}`);

// getting only the bio details of the author ( not the cards of this order) ( for the page header)
useEffect( async () => {
// do we need to change where this data is being stored ??? ie. another state.
    let authorData = (await getDocs( query(collection( db , "users" , userUid , "authorPool" ) , where( "uid" , "==" , authorUid )) )).docs[0].data();     // // change this. // the second uid in the where from a string to a variable 
    let { name , bio , avatar , website , twitter , background , uid } = authorData;
    setAuthorBioDetails({ name , bio , avatar , website , twitter , background, uid  });
} , [])

  useEffect( () => {
    console.log("inside the useEffect, check the cards array out");
    console.log(cards);
    console.log("still inside the useEffect, check the uid out");
    console.log(userUid);
    console.log("Author uid")
    console.log(authorUid); 

    // change this query --> this is a single author page. it displays all the cards of a PARTICULAR author
    // this query is slightly more complex cause we need to check if a author is included in the tagsArr of a card.
    // although firestore does support querying a collection on the basis of the contents of an array that is set to a document field, the contents should be simple types NOT objects 
    // thus, I was forced to get all cards and filter the needed cards myself locally.
    let unsubscribe = onSnapshot( query( collection(db , "users" , userUid , "cards" ))  , ( querySnapshot ) => {
                // unpack the snapshot returned by onSnapshot and set it to the state
                let cards = querySnapshot.docs.map( ( documentSnapshot) => {
                    // Currently I havent destructured each Card doc. set the whole Card object
                    return documentSnapshot.data();
                })
                // cards now contains an arr of Card objects ( directly from Firebase)
                console.log("in the Author component, pulled the cards from Firebase (all cards) , we will filter then locally")
                console.log("unfiltered cards below")
                console.log(cards);
                // declaring and using it here immediately
                function getCardsOfAuthor( cardsArr , authorUid ){
                    // returns an array of cardObjects. ie. ones that have the author listed in its authorArr
                    console.log(" cardsArr and authorUid passed to getCardsOfAuthor method")
                    console.log(cardsArr);
                    let filtered = cardsArr.filter( ( cardObj ) => {
                        // cardsArr expects a boolean
                        let includeCard = false;    // assuming that the card does not include the current author
                        
                        for( let authorObj of cardObj.authorsArr ){
                            if(authorObj.uid === authorUid){
                                includeCard = true;
                                break;
                            }
                        }
                
                        return includeCard; // this will be true or false // when true, the current object will be included in the returned array by filter method. When false, it will be filtered out
                    })

                    return filtered;
                }

                cards = getCardsOfAuthor(cards , authorUid)    // TODO -- turn 
                console.log("cards that belong to this author")
                console.log(cards);

                // set the card arr to state. 
                setCards(cards);
    })

    return ( () => {
        console.log("unsubscribing from realtime card updates before unmouting");
        unsubscribe();
    })
} , [authorUid])

// checking the correct cards arr has been found.
useEffect( () => {
    console.log(cards);
} , [ cards ] )

// should delete the current author that is in firebase. + remove the author from all the cards that contained the author.
function deleteAuthor(){
    (async () => {
        try{
            // 1. remove the tag from the tagPool
            let xquery = query( collection( db , "users" , userUid , "authorPool") , where("uid" , "==" , authorUid) ) 
            let targetDocRef = (await getDocs( xquery )).docs[0].ref;
            await deleteDoc(targetDocRef);
            console.log(`${authorUid} author deleted successfully from authorPool`);

            // 2. remove the topic ( tag ) from every card that had the tag in it -- ( all the cards in the cards State )
            
            //2.1 process the cards -- sync part
            // processedCards is the arr of cards after the current Tag is removed from their tagsArr.
            let processedCards = cards.map((cardObj) => {
                // removes the curr page card obj from the list of card objects of a particular ar
                    let filteredAuthors = cardObj.authorsArr.filter((authorObj) => {
                        return authorObj.uid != authorBioDetails.uid;
                    })
                // replacing the old tagsArr with the filteredTagsArr ie. the deleted tags are excluded in this new arr
                cardObj.authorsArr = filteredAuthors;   
                if(cardObj.authorsArr.length === 0){ cardObj.inQueue = true }  // checking if the card , once modified , should be in the queue

                return cardObj;
            })

            console.log(processedCards)

            
            // 2.2 set ( update ) all the updated cards to Firebase 
            // involves a ton of async operations which we will make work with Promise.all()
            Promise.all(
                processedCards.map( (processedCard) => {
                    console.log(`trying to update ${processedCard.uid }`)
                    console.log(processedCard); 
                    return getDocs (query ( collection( db , `users/${userUid}/cards` ) , where( "uid" , "==" , processedCard.uid) ) )
                    .then( (querySnapshot) => {
                        // current card query doc snapshot ( contians ref in addition to data)
                        let currentCardRef = querySnapshot.docs[0].ref;
                        // passing a subset of obj to the updateDoc for efficiency sake. 
                        // If the partial object does not update the object in firestore properly, give it the full object
                        updateDoc( currentCardRef , { authorsArr : processedCard.authorsArr , inQueue : processedCard.inQueue  }  )
                    })
                })
             ).then(() => {
                console.log("tags removed from cards successfuly");
             }).catch( (error) => {
                 console.log(error);
             })


        }
        catch(error){
            console.log(error);
            console.log(`Error while trying to delete author with uid ${authorUid}`)
        }
    })();
}

    return (
        <> 
            <Navbar/>
            <CssBaseline />
            <Box sx={{  background: "#e96443" , 
                        background: "-webkit-linear-gradient(to bottom, #904e95, #e96443)",
                        background: "linear-gradient(to bottom, #904e95, #e96443)",}}>
            <Container maxWidth="lg" sx={{ border : "1px solid lightgrey" , backgroundColor : "#f7fafc"}}  >
                <Box> 
                    <Box >
                        {/* This is the upper half -- contians banner image , author details */}
                        <Box sx={{ pb : "1rem"}}>
                                <Box className="bannerImageContainer" sx={{ height: "200px",  width : "100%" , backgroundColor : "white", overflow : "hidden" }}>
                                        {/* img is not a MUI component. it is a HTML element. We use inline style prop on it instead of the sx prop  */}
                                        <img 
                                            src ={ authorBioDetails.background }
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
                                                    src={ authorBioDetails.avatar ? authorBioDetails.avatar : displayPicPlaceholder }
                                                    // src={ authorBioDetails.avatar  && authorBioDetails.avatar} 
                                                    style={{ height : "100%" , width: "100%", objectFit : "cover" }} 
                                                /> 

                                                {/* try using MUI avatar component instead of the stock html img component  */}
                                            </Box> 
                                        </Box>  
                                        <Box className="middleContainer" sx={{height : "100%" , flexGrow : "2" , display : "flex"}}> 
                                            <Box sx={{ alignSelf : "end" , mb: "1rem"  }}>
                                                <Box sx={{ fontWeight : "600"}} >
                                                    <Stack direction="row" size="0.2rem">
                                                        <Typography sx={{ fontSize : "1.3rem" , fontWeight : "600"}}> { authorBioDetails.name }  </Typography>
                                                        <ModeEditOutlineOutlinedIcon
                                                        sx = {{fontSize : "1.2rem" , ml : " 0.5rem" , position : "relative" , top : "6px" , "&:hover" : { cursor : "pointer" , color : "blue"} }}
                                                        onClick = { () => { authorProfile(authorUid) } } 
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
                                            <Stack direction="row" spacing={1} sx={{ alignSelf : "end" , mb : "1rem"   }}>
                                                
                                                <Button 
                                                variant="contained" 
                                                startIcon={<AddIcon/>} 
                                                onClick = { addCard } 
                                                > 
                                                    New Card 
                                                </Button>

                                                <Button 
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={ deleteAuthor }>
                                                    Delete Author
                                                </Button>

                                            </Stack>
                                        </Box>   
                                </Box> 

                        </Box>  

                        <Grid item container xs={12} columnSpacing="2" className="secondGrid" sx={{position : "sticky", top : 0}} >
                                <Right formProps={formProps} setFormProps={setFormProps} cardType={"details"} cardDataArr ={ cards } parentPage="author" />
                        </Grid> 

                    </Box>
                </Box>
            </Container>

            {/* notice when Forms will render. ie. only when formProps is not undefined ie. its initial state (check formsContext.jsx ) */}
           { formProps &&  <Forms /> }
            
            </Box>
            
        </>

    );
}
 
export default Author;


