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


const Explore = () => {
    return (
        <> 
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
                        <Typography sx={{ textDecoration : "underline"}}>  View More </Typography>
                </Box> 
                
                <Box display="grid" gridTemplateColumns="repeat( 2 , 1fr)" gridTemplateRows="repeat( autoFit , 110px )" gap={2} sx={{ border : "1px solid #EDF2F7" }} > 
                    
                {/* do not change this component to box else the grid responsive spanning will get messed up */}
                    <Box className="creatorCard" gridColumns={{ xs:"span 2", sm:"span 1" }}> 
                        <Box sx={{  p:"1.5rem", width : "100%" , borderRadius : "5px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }} >
                            <Box  sx={{ display : "flex" , gap : "1" ,  flexDirection : "row"}}>
                                <Avatar sx={{ height : 65 , width : 65 , alignSelf : "center", border :"3px solid white"}} src="https://atlasappimages.s3.amazonaws.com/production/people/144/original/James.PNG?1626238067" /> 
                                <Box sx={{ pl : "1rem"}}>
                                    <Typography variant="h5" sx={{ fontSize : "primary"}}> James Clear</Typography>
                                    <Box >
                                        <BookmarksOutlinedIcon sx={{ fontSize : "1rem"}} /> 
                                        <Typography gutterBottom="true" noWrap="true" variant="body" sx ={{ position : "relative" , bottom : "2px" , fontSize : '1rem'}} >
                                            477 Posts 
                                        </Typography> 
                                    </Box>
                                </Box> 
                            </Box> 
                        </Box> 
                    </Box>




                </Box>
            </Paper>

            </Container>
        </Box>
        </>
      );
}
 
export default Explore;
