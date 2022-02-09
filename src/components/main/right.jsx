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
import IconButton from "@mui/material/IconButton";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Button from "@mui/material/Button"
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import GenericCard from "./GenericCard"
import { useEffect , useState , useContext } from "react";
import { query , collection , onSnapshot , orderBy } from  "firebase/firestore"
import { db } from "../../firebase/firebase";
import { authContext } from "../../contexts/authContext"


// cardType refers to the modes of the genericCard ( different modes have different UI) check the GenericCard component for details on the different available modes for Generic Card.
 
const Right = ({ cardType , formProps , setFormProps , cardDataArr , parentPage }) => {
    // "parentPage" can be main / explore / queue / author / topic. having this info is useful to customize the behavior of The Right.jsx component based on which page it is being used by. 
    
    console.log("right component");

    useEffect( () => {
        console.log(cardDataArr);
    } , [cardDataArr] )

    return ( 
    <>
    <Paper variant="outlined" sx={{ boxShadow : 1 , minHeight : "90vh" , width : "100%", p : 1 }} >                      
        <Stack direction="row" spacing={1} sx={{pb : 1.5 }}>
            <Typography >
                Cards ({ cardDataArr.length})
            </Typography> 
        </Stack>

        <Box> 
        
        {
            // rendering all the cards
            cardDataArr.map( (card) => {
                return <GenericCard variant="outlined" sx={{ width: "100%", height :"150px" }} cardData={ card } cardType={ cardType}  />
            })
        }

        {/* if card count 0  , display a suitable message according to which page the 0 cards are in */}
        
        {
        // 0 cards in Main.jsx page   
            (cardDataArr.length === 0) 
            &&             
            (<>
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
                        { parentPage === "main" && "No cards to see here !!" }  
                        { parentPage === "queue" && "The Queue is empty" }  
                        { parentPage === "author" && "No cards to see here" } 
                        { parentPage === "topic" && "No cards to see here" } 
                    </Typography>
                
                </Box>
            </Box>
                     
            </>)   
        }

        </Box>
    </Paper>
    </> 
    );
}
 
export default Right;
