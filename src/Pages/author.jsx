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
import Image from "../assets/author-background.jpg"
import Forms from "../components/forms/Forms.jsx"
import { useState } from "react";
import { formTriggers} from "../components/forms/Forms";
import Navbar from "../components/Navbar"

let  Author = (props) => {

// formType options -- cardForm , cardFormEdit , userBioForm , userBioFormEdit , authorBioForm , confirmDelete ,  (choses the form to be displayed within the drawer)

let [ formProps , setFormProps] = useState();
let { editAuthorProfile , deleteCard , addCard , editCard } = formTriggers;     // destructuring all the available triggers.
let resetFormProps = () => {
    setFormProps( );
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
                        <Box className="upperHalf" sx={{ }} onClick={"" } >
                            <Box className="bannerImageContainer" sx={{ height: "200px",  width : "100%" , backgroundColor : "red" , backgroundImage : `url(${Image})`  }}>
                            </Box > 
                            <Box sx={{ height:"auto"}} >
                                <Box   sx={{  height:"auto" , bottom : "100px" , width : "max-content"}} >
                                        <Box sx={{ height : "144px" , width : "144px" , position : "absolute" , top : "130px" ,  backgroundColor : "white" , borderRadius : "50%" , boxShadow : "1" }}> </Box>
                                        <Box className="spacerBox" sx={{ height : "72px"}}> </Box>
                                        <Box sx={{ alignSelf : "end" , mb: "1rem"  }}>
                                            <Box sx={{ fontWeight : "600"}} >
                                                <Stack direction="row" size="0.2rem">
                                                    <Typography sx={{ fontSize : "1.3rem" , fontWeight : "600"}}> Don Henley  </Typography>
                                                    <ModeEditOutlineOutlinedIcon 
                                                    sx = {{fontSize : "1.2rem" , ml : " 0.5rem" , position : "relative" , top : "6px" , "&:hover" : { cursor : "pointer" , color : "blue"} }} 
                                                    onClick = { () => {  editAuthorProfile( formProps , setFormProps ) } }
                                                    />
                                                </Stack> 
                                            </Box> 
                                            <Box > Frontman for the Eagles </Box> 
                                            <Stack direction="row">
                                                <BookmarkBorderIcon/>
                                                <Typography> 1700 cards </Typography>
                                            </Stack> 
                                        </Box>
                                        <Stack direction="row" sx={{ alignSelf : "end" , mb : "1rem"}}>
                                            <Button 
                                            variant="contained" 
                                            startIcon={<AddIcon/>}
                                            onClick = { () => { addCard( formProps , setFormProps ) }  }
                                            > 
                                                New Card 
                                            </Button>
                                        </Stack>
                                             
                                </Box> 
                            </Box>

                        </Box>  



                        <Grid item container xs={12} columnSpacing="2" className="secondGrid" sx={{position : "sticky", top : 0}} >
                                <Right/>
                        </Grid> 

                    </Box>
                </Box>
            </Container>

            
           { formProps &&  <Forms { ...formProps } setFormProps = {setFormProps} resetFormProps = { resetFormProps} /> }
            
            </Box>
            
        </>

    );
}
 
export default Author;


