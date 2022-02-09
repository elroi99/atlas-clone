import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from "@mui/material/Box";
import Link from "@mui/material/Link"
import Typography  from "@mui/material/Typography";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Icon from "@mui/material/Icon"
import { useState , useEffect , useContext  } from "react";
import { query , collection , getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase"; 
import { authContext } from "../../contexts/authContext";
import { useHistory } from "react-router-dom";

const   LeftEx = (props) => {

        let [ topics , setTopics ] = useState([])
        let {uid : userUid } = useContext(authContext);
        let history = useHistory();

        useEffect(() => {
            (async() => {
                let topics = ( await getDocs( query(collection( db , "users" , userUid , "tagPool")) )  ).docs;
                let tempArr = topics.map( (topicsDocSnapshot) => {
                    return topicsDocSnapshot.data();
                })
                topics = tempArr;
                console.log("the topics pulled for the main page left section ( topics list )")
                console.log(topics);
                setTopics(topics);
            })();
           
        } , [])

        
        return(
            <Box sx={{ width: '100%' , px : 1  }}>

                <Typography sx={{ py : 1 , pl : 1 , fontWeight : 4 , fontSize : "1rem"}}>
                    Topics  
                </Typography> 

                <Divider />

                <Box sx={{ display : "flex" , flexDirection : "row" , py : 0.8}}> 
                    <KeyboardArrowRightIcon sx={{ position : "relative" , top : "2px"}}/> 
                    <Link href="#" underline="none" sx={{ mr : "auto" }}>All</Link> 
                </Box> 

                <Divider />

                <Stack sx={{overflowY : "scroll" , pl : 0.5 , pt : 1 , py : 2 }}>

                    { topics.map( (topic) => { return ( 
                        <Box sx={{ display : "flex" , flexDirection : "row"}} onClick={ () => {history.push(`/topic/${topic.uid}`)} }> 
                            <KeyboardArrowRightIcon sx={{ position : "relative" , top : "2px"}}/> 
                            <Typography href="#" underline="none" sx={{ mr : "auto" , color : "gray" , "&:hover": {  cursor : "pointer" , color : "blue"} }}> {topic.name} </Typography> 
                        </Box>
                    )}) }
 
                </Stack>

            </Box> 
        )
    };

 
export default LeftEx;