import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from "@mui/material/Box";
import Link from "@mui/material/Link"
import Typography  from "@mui/material/Typography";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Icon from "@mui/material/Icon"

const LeftEx = (props) => {

        const arr = [ "first" , "second" , "third" , "fourth" , "fifth" , "first" , "second" , "third" , "fourth" , "fifth" , "first" , "second" , "third" , "fourth" , "fifth"]
        
        return(
            <Box sx={{ width: '100%' , px : 1 }}>

                <Typography sx={{ py : 1 , pl : 1 , fontWeight : 4 , fontSize : "1rem"}}>
                    Topics  
                </Typography> 

                <Divider />

                <Box sx={{ display : "flex" , flexDirection : "row" , py : 0.8}}> 
                    <KeyboardArrowRightIcon sx={{ position : "relative" , top : "2px"}}/> 
                    <Link href="#" underline="none" sx={{ mr : "auto" }}>All</Link> 
                </Box> 

                <Divider />

                <Stack sx={{overflowY : "scroll" , pl : 0.5 , pt : 1}}>

                    { arr.map( (topic) => { return ( 
                        <Box sx={{ display : "flex" , flexDirection : "row"}}> 
                        <KeyboardArrowRightIcon sx={{ position : "relative" , top : "2px"}}/> 
                        <Link href="#" underline="none" sx={{ mr : "auto" , color : "gray" , "&:hover": {  cursor : "pointer" , color : "blue"} }}>{topic}</Link> 
                    </Box> 
                    )}) }

                </Stack>

            </Box> 
        )
    };

 
export default LeftEx;