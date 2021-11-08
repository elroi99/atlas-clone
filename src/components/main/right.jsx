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
 
const Right = (props) => {

    return ( 
    <>
    <Paper variant="outlined" sx={{ boxShadow : 1 , height : "100%" , width : "100%", p : 1 }} >                      
        <Stack direction="row" spacing={1} sx={{pb : 1.5 }}>
            <Typography >
                Posts ( 1220)
            </Typography> 
        </Stack>

        <Box > 

            <Card   variant="outlined" className="ContentCard" sx={{ width: "100%", height :"auto" , px : 2 , py : 1 , mb : 1.5  }} >
                        <Box> 
                            <Grid container className="CardTitleContainer" direction="row"  sx={{ justifyContent : "space-between" , wrap : "nowrap"}} > 
                                <Grid item container className="postChipAndTitle"  xs={11}  direction="row" wrap="nowrap" columnSpacing={1} > 
                                    <Grid item><Chip size="small"  icon={<LibraryBooksIcon />} label="Post" /> </Grid>
                                    <Grid item> <Typography noWrap="false" sx={{ fontSize : " 1.07rem" , overflow : "hidden" , position : "relative" , top : "2px" }}> 21 Awesome Takeaways from Atomic 21 Awesome Takeaways from Atomic 21 </Typography></Grid>
                                </Grid>
                                <Grid item className="expandArrow"  xs={1} sx={{position : "relative" , bottom : "6px" }} > <IconButton sx={{  "&:hover": { color : "blue"}}}> <KeyboardArrowDownIcon/> </IconButton> </Grid>
                            </Grid>
                        </Box>
        
                        <Box className = "previewContainer" > 
                            <Typography  sx={{fontSize : "0.9rem" ,  height : "auto" , width : "100%" , borderRadius : "4px" , my: 1 , p : 0.5 , pb : "2rem" , boxShadow : 1 , backgroundColor : "white" }}  >
                            Today, people have to work too hard to find what they want online, sifting through and steering clear of content, clutter and click-bait not worthy of their time. Over time, navigation on the internet has become increasingly centralized and optimized for clicks and scrolling, not for getting people to where they want to go or what they are looking for quickly. 
                            </Typography> 
                        </Box>

                        <Box   sx ={{  gap:"1" ,display:"flex", flexDirection:"row",  width:"100%", justifyContent:"space-between" , mt : 1 }} >
                            <Box classname="leftHalf"  gap={1} sx={{ display:"flex" , flexDirection:"row"  }} >
                                <Box sx={{minWidth : "max-content"}}>
                                    < AccountCircleOutlinedIcon sx={{ position : "relative" , top : "4px" , fontSize : "1rem"}}  />
                                    < Typography  sx ={{ display : "inline" , pl : 0.5 , fontSize : "0.8rem" , noWrap:"false"}}> Saved to  </Typography>
                                </Box>
                                <Box >
                                    <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
                                        <Chip size="small" label="business" sx={{boxShadow : 1 , "&:hover" : {textDecoration : "underline" , cursor : "pointer"}  }} ></Chip>
                                        <Chip size="small" label="cars" sx={{boxShadow : 1 , "&:hover" : {textDecoration : "underline" , cursor : "pointer"}}} ></Chip>
                                        <Chip size="small" label="startup" sx={{boxShadow : 1 , "&:hover" : {textDecoration : "underline" , cursor : "pointer"}}} ></Chip>
                                    </Box>
                                </Box>
                            </Box>
                            <Box classname="ProcessBtnContainer"  >
                                <Typography display="inline" fontSize="0.8rem">  2 months ago</Typography> 
                                 <ModeEditOutlinedIcon sx={{ fontSize:"1rem" , "&:hover": {  cursor : "pointer" , color : "blue" } }} /> 
                                <DeleteForeverOutlinedIcon sx={{ fontSize:"1rem" , "&:hover": {  cursor : "pointer" , color : "blue"}} }/>
                            </Box>
                            
                        </Box>

                    </Card> 

        <Card variant="outlined" sx={{ width: "100%", height :"150px" } }>      </Card> 
        <Card variant="outlined" sx={{ width: "100%", height :"150px" } }>      </Card>
        <Card variant="outlined" sx={{ width: "100%", height :"150px" } }>      </Card>
        <Card variant="outlined" sx={{ width: "100%", height :"150px" } }>      </Card>

        </Box>
    </Paper>
    </> 
    );
}
 
export default Right;
