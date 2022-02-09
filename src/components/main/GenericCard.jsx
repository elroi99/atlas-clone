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
import Forms from "../forms/Forms.jsx"
import { useState } from "react";
import { formsContext } from "../../contexts/formsContext";
import { authContext } from "../../contexts/authContext";
import { useContext } from "react"
import { useHistory } from "react-router-dom";
 
// The generic card has 2 modes. "details" card and "queue" card . they can be toggled by changing the cardType prop. by default, the card will be configured as a queue card ie. this variant has a "Process" button. no need to pass any prop to use this card 
// If however, you want a details card. ie. small variation. ie. Process btn is replaced with 2 buttons. 1. edit 2. delete. if you want this, pass in the cardType prop with value "details". while using the card. 

const GenericCard = ({ cardType = "details" , cardData }) => {
    console.log("Inside generic card")
    console.log(cardData);
    let { formProps , addCard , showConfirmDelete , editCard , closeForm  } = useContext(formsContext)
    let { uid : userUid } = useContext(authContext);
    let history = useHistory();
    let cardUid = cardData.uid;
    

    const styles = {
        // first way of writing styles ie. create a set of k-v pairs in an object , then use them in 
        // the sx of the element in which you intend to use them. eg. sx={{ styles.contentCard}}
        "contentCard" : { 
            width: "100%", 
            height :"auto" , 
            px : 2 , 
            py : 1 , 
            mb : 1.5 
        },
        "cardTitleContainer" : {
            justifyContent : "space-between" ,
            wrap : "nowrap" 
        },
        "cardTitle" : { 
            fontSize : " 1.07rem" , 
            overflow : "hidden" , 
            position : "relative" , 
            top : "2px" },
        "expandArrow" : {
            position : "relative" ,
            bottom : "6px"
        },
        "previewContent" : { 
            fontSize : "0.9rem" ,
            height : "auto" , 
            width : "100%" , 
            borderRadius : "4px" , 
            my: 1 , p : 0.5 , 
            pb : "2rem" , 
            boxShadow : 1 , 
            backgroundColor : "white" 
        },
        "metaCotainer" : {  
            gap:"1" ,
            display:"flex", 
            flexDirection:"row",  
            width:"100%", 
            justifyContent:"space-between" , 
            mt : 1 
        },
        "leftHalf" : { 
            display:"flex" , 
            flexDirection:"row",
            gap : 1,
         },
         "savedToContainer" : {
             minWidth : "max-content"
        },
        "accountCircleIcon" : { 
            position : "relative" , 
            top : "4px" , 
            fontSize : "1rem"
        },
        "savedToLabel" : { 
            display : "inline" , 
            pl : 0.5 , 
            fontSize : "0.8rem" , 
            wrap:"nowrap"
        },
    }


    return(
        <>             
            <Card variant="outlined" className = "contentCard" sx={ styles.contentCard }>
    
                <Grid container className="cardTitleContainer" direction="row"  sx={ styles.cardTitleContainer }> 
                    <Grid item container className="postChipAndTitle"  xs={11}  direction="row" wrap="nowrap" columnSpacing={1} > 
                        <Grid item><Chip size="small"  icon={<LibraryBooksIcon />} label="Post" /> </Grid>
                        <Grid item> <Typography className="cardTitle" wrap="nowrap" sx={ styles.cardTitle }> { cardData.name } </Typography></Grid>
                    </Grid>
                    <Grid item className="expandArrow"  xs={1} sx={styles.expandArrow} >
                         <IconButton 
                         className="expandArrowIconButton" 
                         sx={{  "&:hover" : { color : "blue"}}}
                        //  onClick = {}
                         > 
                            <KeyboardArrowDownIcon/> 
                         </IconButton> 
                    </Grid>
                </Grid>

                <Box className = "previewContainer" > 
                    <Typography className="previewContent"  sx={styles.previewContent}  >
                        { cardData.title}
                    </Typography> 
                </Box>

                <Box className="metaContainer" sx ={styles.metaCotainer} >
                    <Box classname="leftHalf"  gap={1} sx={ styles.leftHalf } >
                        <Box className="savedToContainer" sx={styles.savedToContainer}>
                            < AccountCircleOutlinedIcon className="accountCircleIcon" sx={styles.accountCircleIcon}  />
                            < Typography className="savedToLabel" sx ={styles.savedToLabel}> Saved to  </Typography>
                        </Box>
                        {/* <Box > */}
                        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
                            { 
                                cardData.tagsArr.map( (tagObj) => {
                                    let topicUid = tagObj.uid;
                                    return ( <Chip size="small" label={tagObj.name} className="tagChip" sx={{boxShadow : 1 , "&:hover" : {textDecoration : "underline" , cursor : "pointer"}  }} onClick={ () => { history.push(`/topic/${topicUid}`)}}> </Chip> )
                                })
                            }
                        </Box>
                        {/* </Box> */}
                    </Box>
                    <Box classname="ProcessBtnContainer" display="flex" gap={1} flex="0 0 max-content">
                        
                        {/* commenting this out till I get a handle on date and time */}
                        {/* <Typography display="inline" sx={{ fontSize:"0.8rem" , paddingRight : "1rem"}} >  2 months ago </Typography>  */}
                        
                        { cardType === "details" ?
                            (<Box display="flex" gap={1} flex="0 0 max-content"> 
                                <ModeEditOutlinedIcon 
                                sx={{ fontSize:"1rem", position : "relative" , top : "3px" , "&:hover": {  cursor : "pointer" , color : "blue" } }}
                                onClick = { () => { editCard(cardData.uid) }  }
                                 /> 
                                <DeleteForeverOutlinedIcon 
                                sx={{ fontSize:"1rem" , position : "relative" , top : "3px",  "&:hover": {  cursor : "pointer" , color : "blue"}} }
                                onClick = { () => { 
                                    console.log("delete icon was clicked in the generic card")
                                    showConfirmDelete(cardUid) }  }
                                 />
                            </Box>) 
                                : 
                            <Box display="flex" gap={1} flex="0 0 max-content"> 
                                <Button 
                                variant="outlined"  sx ={{ ml : 1 , padding : 2 , color : "black" , maxWidth : "300px" , height : "20px" }} 
                                onClick = { () => { editCard(cardData.uid)  } }
                                > 
                                    Process 
                                </Button>

                                <DeleteForeverOutlinedIcon 
                                sx={{ fontSize:"1rem" , position : "relative" , top : "3px",  "&:hover": {  cursor : "pointer" , color : "blue"}} }
                                onClick = { () => { showConfirmDelete(cardUid) }  }
                                 />
                            </Box>
                        }

                    </Box>
                </Box>
                
            </Card>  

        </> 
    );
}
 
export default GenericCard;