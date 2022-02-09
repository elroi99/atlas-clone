import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import  Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Icon from "@mui/material/Icon"
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import Avatar from "@mui/material/Avatar";
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import Navbar from "../components/Navbar"
import { authContext } from "../contexts/authContext";
import { formsContext } from "../contexts/formsContext"
import { useEffect , useState , useContext } from "react";
import { collection, addDoc , deleteDoc , doc , setDoc , getDoc , getDocs , query , where , updateDoc , serverTimestamp , onSnapshot , orderBy } from "firebase/firestore"; 
import { db } from "../firebase/firebase";
import { useHistory } from "react-router-dom";

const Explore = () => {

    let { editAuthorProfile , deleteCard , addCard , editCard , formProps , setFormProps } = useContext(formsContext)
    let resetFormProps = () => {    
        setFormProps( );
      }

    let [ cards , setCards ] = useState([]);   // default value -- no cards
    let { uid : userUid } = useContext(authContext);

      useEffect( () => {
          console.log("inside the useEffect, check the cards array out")
          console.log(cards);
          console.log("still inside the useEffect, check the uid out");
          console.log(userUid);
          let unsubscribe = onSnapshot( query( collection(db , "users" , userUid , "authorPool" ))  , ( querySnapshot ) => {
                      // unpack the snapshot returned by onSnapshot and set it to the state
                      let cards = querySnapshot.docs.map( ( documentSnapshot) => {
                          // Currently I havent destructured each Card doc. set the whole Card object
                          console.log(`card with uid ${documentSnapshot.data().uid}`);
                          return documentSnapshot.data();
                      })
                      // cards now contains an arr of Card objects ( directly from Firebase)
                      console.log("in the Right ( main ) component, pulled the cards from Firebase ( all cards")
                      console.log(cards);
  
                      // set the card arr to state. 
                      setCards(cards);
          })
  
          return ( () => {
              console.log("unsubscribing from realtime card updates before unmouting");
              unsubscribe();
          })
      } , [])


    return (
        <> 
            <Navbar/>
            <CssBaseline/> 
            <Box sx={{      background: "#e96443" , 
                            background: "-webkit-linear-gradient(to bottom, #904e95, #e96443)",
                            background: "linear-gradient(to bottom, #904e95, #e96443)",
                            pt : "2rem",
                            minHeight : "auto"}}>
            <Container maxWidth="lg">

            
            <Paper variant="outlined" sx={{ boxShadow : 1 , minHeight : "100vh" , width : "100%", px : 1 , backgroundColor : "#F7FAFC" }} >  
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ py : 2 }}>
                        <Typography variant="h4"> Creators </Typography>
                        {/* <Typography sx={{ textDecoration : "underline"}}>  View More </Typography> */}
                </Box> 
                
                {
                    
                    cards.length > 0
                    &&
                    <Box display="grid" gridTemplateColumns="repeat( 2 , 1fr)" gridTemplateRows="repeat( autoFit , 110px )" gap={2} sx={{ border : "1px solid #EDF2F7" }} > 
                        
                        {
                            cards.map( (author) => {
                                return <AuthorCard author ={ author } />
                            })
                        }

                    </Box>
                }

                {
                    // in case there are 0 cards, display this message.
                    cards.length === 0 
                    && 
                    <> 
                        <Box sx={{ width : "100%" , minHeight : "130px" , backgroundColor : "#ddddf348" ,  display : "flex" , justifyContent : "center" , alignItems : "center" ,  }}> 
                            <Box 
                            sx={{ 
                                display : "flex" , 
                                justifyContent : "center" , 
                                alignItems : "center" , 
                                borderRadius : "5px",
                                backgroundImage: "linear-gradient(to right, #904e95, #e96443)",
                                backgroundClip : "text",
                                textFillColor : "transparent",
                                backgroundColor : "black",
                                // background: rgb(131,58,180),
                                // background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 33%, rgba(252,176,69,1) 100%),
                                
                                width : "80%"
                                }}> 

                                <Typography sx={{ fontSize : "3.2rem" , fontWeight : "600" , color : "#e0b3e6" , minWidth : "min-content"}}> 
                                    Add a card to create an author
                                </Typography>
                            
                            </Box>
                        </Box>
                    </>
                }


            </Paper>

            </Container>
        </Box>
        </>
      );
}
 
export default Explore;

// to be used in the above page ie Explore component.
const AuthorCard = ({ author }) => {

    // I have currently deactivated the card counter for convenience

    // let [ noOfAuthorCards , setNoOfAuthorCards ] = useState();
    // let { uid : userUid } = useContext(authContext);

    let history = useHistory();

    // run only once. To find out how many cards does this author have.
    // useEffect( () => {
    //     onSnapshot( query( collection(db , "users" , userUid , "cards" ) , where("uid" , "==" , author.uid) ) , (onSnapshot) => {
    //         let noOfAuthorCards = onSnapshot.docs.length;    // how many cards does this author have.
    //         console.log(onSnapshot.docs);
    //         setNoOfAuthorCards(noOfAuthorCards);    // settting the state
    //     } )

    // } , [])

    // get the photo of the author from firestore 
    // useEffect( () => {
    //     onSnapshot( )
    // })

    return( 
        <Box 
        className="creatorCard" 
        gridColumns={{ xs:"span 2", sm:"span 1" }}
        onClick={ () => {
            console.log(`user clicked on  author with uid ${author.uid} , redirecting to author page`) 
            history.push(`/author/${author.uid}`) } }> 
        <Box sx={{  p:"1.5rem", width : "100%" , borderRadius : "5px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }} >
            <Box  sx={{ display : "flex" , gap : "1" ,  flexDirection : "row"}}>
                <Avatar sx={{ height : 65 , width : 65 , alignSelf : "center", border :"3px solid white"}} src={ author.avatar } /> 
                <Box sx={{ pl : "1rem"}}>
                    <Typography variant="h5" sx={{ fontSize : "primary"}} noWrap = { true }> { author.name } </Typography>
                    
                    {/* Deactivating the card count for convenience */}
                    {/* <Box >
                        {
                            noOfAuthorCards 
                            && 
                            (
                                <> 
                                    <BookmarksOutlinedIcon sx={{ fontSize : "1rem"}} /> 
                                    <Typography gutterBottom="true" noWrap="true" variant="body" sx ={{ position : "relative" , bottom : "2px" , fontSize : '1rem'}} >
                                        { noOfAuthorCards } 
                                    </Typography> 
                                </>
                            )

                        }

                    <BookmarksOutlinedIcon sx={{ fontSize : "1rem"}} /> 
                    <Typography gutterBottom="true" noWrap="true" variant="body" sx ={{ position : "relative" , bottom : "2px" , fontSize : '1rem'}} >
                        { noOfAuthorCards } 
                    </Typography> 

                    </Box> */}

                </Box> 
            </Box> 
        </Box> 
    </Box>        
    )
} 


