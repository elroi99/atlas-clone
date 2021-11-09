import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack"
import Chip from "@mui/material/Chip"
import { Link} from "react-router-dom"
import Author from "./author"
import CardForm from "./forms/cardForm";
import AuthorForm from "./forms/authorForm";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import IconButton from '@material-ui/core/IconButton';
import { useState } from "react";

let Navbar = (props) => {

  const [ loginState , changeLoginState] = useState(false);

  let handleLoginClick = () => {
    ( loginState === false ) ? changeLoginState(true) : changeLoginState(false)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed"  sx={{ backgroundColor : "#FFFFFF" , textColor : "black" , padding : "0px" }}>

        <Toolbar sx={{display : "flex" , justifyContent : "center", height : "100%" , disableGutters : 'true'}}>

          <Stack direction="row" justifyContent="center" spacing={10} sx={{ height : "100%" }} > 
            
              <Typography variant="h6" component="div" sx={ { flexGrow : "1"  }}  >
                <Link to="/" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"}}}>
                  Profile
                  </Link>
              </Typography>
            
            <Stack direction="row" sx={{ color : "#a4b1c3" }}> 
                <Typography variant="h6" component="div" sx={{ flexGrow : "1" }}>
                    <Link to="/queue" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"} }} > 
                      Queue
                    </Link>
                </Typography>
                <Chip label="234" size="small" sx={{ position : "relative" , top : "5px" , ml : "0.2rem" , color : "red" , backgroundColor : "#ffbcb8"}} /> 
            </Stack>

            <Typography variant="h6" component="div" sx={{ flexGrow : "1" }}>
                    <Link to="/explore" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"} }} > 
                      Explore
                    </Link>
            </Typography>

            <Typography variant="h6" component="div" sx={{ flexGrow : "1" }}>
                    <Link to="/author" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"} }} > 
                      Author
                    </Link>
            </Typography>

            <Typography variant="h6" component="div" sx={{ flexGrow : "1" }}>
                    <Link to="/authorForm" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"} }} > 
                      AuthorForm
                    </Link>
            </Typography>

            <Typography variant="h6" component="div" sx={{ flexGrow : "1" }}>
                    <Link to="/cardForm" style={{ textDecoration : "none" , color : "#b5b3ac" , "&:hover" : { color : "#5b68d8"} }} > 
                      CardForm
                    </Link>
            </Typography>

            {/* this iconbutton is pushing the topbar links for some reason */}
            <IconButton onClick ={ handleLoginClick } sx ={{ position : "relative" , bottom : "20px"}}> 
              { loginState === true ? <AccountCircleIcon/> : <LoginIcon/> }
            </IconButton>

            
          </Stack>

        </Toolbar>

      </AppBar>
    </Box>
  );
}


export default Navbar;

