import Box from "@mui/material/Box"
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import ClearIcon from '@mui/icons-material/Clear';
import Paper from "@mui/material/Paper"
import { Typography } from "@material-ui/core";



const CardForm = () => {

    // tab change logic. powers the conditional rendering too. 
    let [ activeTab , activeTabSetter] = useState("single");
    let changeActiveTab = () => {
        ( activeTab === "single" ) ? activeTabSetter("multiple") : activeTabSetter("single");
        console.log(activeTab);
    }



    const defaultValues = { 
        linkArr : []
    }

    const [ formValues , setFormValues ] = useState(defaultValues);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            // something here. ........ 
        });
      };

    const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formValues);
    };

    return (

        <Paper sx={{ p : 1 , width : "400px" , height : "500px" }}>
            <Box>
                <ClearIcon sx={{  display : "block", marginLeft : "auto" ,  }} />
            </Box>
            <Typography variant="h5" sx ={{ ml : 1}}> Add Cards </Typography>
            <Box sx={{ display : "flex"}}>
                <Button onClick={ changeActiveTab } >  Add single link </Button> 
                <Button onClick={ changeActiveTab } > Add multiple link</Button> 
            </Box> 

            <Box component="form" onSubmit={ (e) => { handleSubmit(e) } } >
                { 
                    (activeTab === "single") ? 
                    (<TextField id="outlined-basic" type="text" label="Paste Link Here " variant="outlined" size="small" sx={{ display:"block"}} /> )  :
                    ( <TextField id="outlined-basic" multiline rows={6} label="Paste multiple here " variant="outlined" size="small" sx={{ display:"block"}} /> )
                } 
                
                <Button variant="contained" color="primary"  type="submit" > 
                    Submit
                </Button>
            </Box>
        </Paper>
        
     );
}
 
export default CardForm;