import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Right from "./right.jsx"
import LeftEx from './leftEx.jsx';
import createTheme from "@mui/material/styles/createTheme"
import Stack from "@mui/material/Stack";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add';
import Button from "@mui/material/Button";
import ModeEditOutlineTwoToneIcon from '@mui/icons-material/ModeEditOutlineTwoTone';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';


let  Main = (props) => {

    const theme = createTheme();    // will give us the default theme object. 
    console.log(theme);

    return (
        <> 
            <CssBaseline />
            <Box sx={{  background: "#e96443" , 
                        background: "-webkit-linear-gradient(to bottom, #904e95, #e96443)",
                        background: "linear-gradient(to bottom, #904e95, #e96443)",}}>
            <Container maxWidth="lg" sx={{ border : "1px solid lightgrey" , backgroundColor : "#f7fafc"}}  >
                <Box> 
                    <Box sx={{ minHeight: '100vh', px : 0.1 }} >
                        <Box sx={{ pb : "1rem"}}>
                            <Box className="bannerImageContainer" sx={{ height: "200px",  width : "100%" , backgroundImage : `url("https://pbs.twimg.com/media/D-o1R97UIAMTOlB.jpg")`  }}>
                                {/* <img src="https://pbs.twimg.com/media/D-o1R97UIAMTOlB.jpg" />  */}
                            </Box > 
                            <Box   sx={{ display:"flex", flexDirection:"row"  , height:"100px"}} >
                                    <Box className="displayPicContainer" sx={{height : "100%", flex : "0 0 200px", maxWidth : "200px" }}> 
                                        <Box sx={{ height : "145px" , width : "145px" , backgroundColor : "white" , borderRadius : "50%" , position : "relative" , left : "10%" , bottom : "50%" , boxShadow : "1" }}> </Box> 
                                    </Box>  
                                    <Box className="middleContainer" sx={{height : "100%" , flexGrow : "2" , display : "flex"}}> 
                                        <Box sx={{ alignSelf : "end" , mb: "1rem"  }}>
                                            <Box sx={{ fontWeight : "600"}} >
                                                <Stack direction="row" size="0.2rem">
                                                    <Typography sx={{ fontSize : "1.3rem" , fontWeight : "600"}}> Atlas Content  </Typography>
                                                    <ModeEditOutlineOutlinedIcon sx = {{fontSize : "1.2rem" , ml : " 0.5rem" , position : "relative" , top : "6px" , "&:hover" : { cursor : "pointer" , color : "blue"} }} />
                                                </Stack>
                                                 
                                            </Box> 
                                            <Box > Content Curation Specialist </Box> 
                                            <Stack direction="row">
                                                <BookmarkBorderIcon/>
                                                <Typography> 1700 cards </Typography>
                                            </Stack> 
                                        </Box> 
                                    </Box>
                                    <Box className="rightContainer" sx={{height : "100%" , flexGrow : "1" , display : "flex"}}>
                                        <Stack direction="row" sx={{ alignSelf : "end" , mb : "1rem"}}>
                                            <Button variant="contained" startIcon={<AddIcon/>} > New Card </Button>
                                        </Stack>
                                    </Box>   
                            </Box> 

                        </Box>  

                        <Grid item container xs={12} columnSpacing="2" className="secondGrid" sx={{position : "sticky", top : 0}} >
                            <Grid item xs={12} md={3}>
                                <Paper variant="outlined" sx={{ boxShadow : 1 , height : "100%" , width : "100%" } }> 
                                    <LeftEx/>
                                </Paper>
                            </Grid> 

                            <Grid item xs={12} md={9}>
                                <Right/>
                            </Grid>
                        </Grid> 

                    </Box>
                </Box>
            </Container>
            </Box>
        </>

    );
}
 
export default Main;