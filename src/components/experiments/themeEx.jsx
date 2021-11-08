// just figuring out how to use theme object, sx property etc. how to set :hover states etc etc. 
// trying to find out how to use the theme variables through sx prop
import { Typography } from "@mui/material";
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import createTheme from "@mui/material/styles/createTheme"
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box"


// to learn mui styling --> "smartdevpreneur complete guide to mui button color"


const ThemeEx = () => {
    // creating this theme just to log the theme to console. just to see it 
    const theme = createTheme();
    console.log(theme);

    // customizing a component by putting it directly in the theme.components
    // this can be done by using a combination of the createTheme() fn, the 
    // components key (within the theme) and the styleOverrides key too. 

    // the pattern components key > 
    const customTheme = createTheme({
        components : {
            MuiButton : {
                styleOverrides : {
                    "outlinedPrimary" : {
                        // css rules in here for a btn with variant="outlined" and color="primary"
                        // read description of outlinedPrimary in the CSS section of the button api ref
                        backgroundColor : "green",
                        color : "red",
                        fontSize : "100px",
                    }
                }
            }
        }
    })
    

    // the object to be passed to the sx. 
    // this is a js object ultimately. thus it will more or less adhere to the js object syntax rules
    const btnStyle = {
        "&.MuiButton-outlined": {
            color : "black",
            border : "5px solid red",
            // 1.2.---- equivalent syntax apparently ( although this should be cleaner)
            "&:hover" : {
                border : "5px solid black"
            }
        },
        // 1.2.---- equavalent syntx apparently 
        "&.MuiButton-outlined:hover":{
            border : "5px solid black"
        },
        "&.MuiButton-text": {
            border : "2px dotted pink",
            // using the cleaner nested syntax for the :hover pseudo selector
            "&:Hover" : {
                border : "5px solid green"
            }
        }
    }
    
    return ( 
    <>
    <Stack spacing={1}>
        <Divider> button variants </Divider>
        <Button variant="text" size="small" disableRipple="true" fullWidth="false" > text btn size small</Button> 
        <Button variant="outlined" size="medium"> outlined btn size medium </Button> 
        <Button variant="contained" size="large" > contained btn variant size large </Button> 
        <Divider> typography variants ( values defined in theme.typography) </Divider>
        <Typography variant="body1"> body1 </Typography> 
        <Typography variant="body2"> body2</Typography> 
        <Typography variant="button"> button </Typography> 
        <Typography variant="caption"> caption </Typography>
        <Typography variant="h1"> h1 </Typography> 
        <Typography variant="h2"> h2</Typography> 
        <Typography variant="h3"> h3 </Typography> 
        <Typography variant="h4"> h4 </Typography>
        <Typography variant="h5"> h5</Typography> 
        <Typography variant="h6"> h6 </Typography> 
        <Typography variant="overline"> overline </Typography>   
        <Typography variant="h6"> h6 </Typography> 
        <Typography variant="subtitle1"> subtitle1 </Typography> 
        <Typography variant="subtitle2"> subtitle2 </Typography>
        <Divider> using the values defined in theme  (eg. theme.palette. ----- guide check sx prop > theme aware properties section) </Divider>
        <Box sx={{display :"flex" , backgroundColor : "primary.main" , height : "auto" , width : "300px" , flexWrap : "wrap"}}>
            <Box sx={{ height : "120px" , width : "120px" , backgroundColor : "secondary.main" , color : "white" , flex: "0 0 auto" }}>  secondary.main </Box> 
            <Box  sx={{ height : "120px" , width : "120px" , backgroundColor : "success.main" , flex: "0 0 auto"}}> success </Box>
            <Box  sx={{ height : "120px" , width : "120px" , backgroundColor : "error.light" , flex: "0 0 auto"}}> error.light </Box> 
            <Box  sx={{ height : "120px" , width : "120px" , backgroundColor : "success.dark" , flex: "0 0 auto"}}> success.dark </Box>  
            <Typography sx ={{ color : "white"}}> not specifying the variant of the color eg secondary instead of secondary.main will not apply the color at all </Typography> 
        </Box>
        <Divider> atlas experiments (different ways to apply styling) </Divider>
          
        <Button variant="outlined" sx={ btnStyle} > see how styles were applied on this button. the object usually passed inside the sx prop has been defined elsewhere and then used  </Button>
        <Button variant="text" sx={ btnStyle} > notice in the code how we have passed the same object (containing styles) to all the buttons but the button only accepts styles that were applied to its correct selectors  </Button>
    </Stack>
        

    </> 
     
     );
}
 
export default ThemeEx;