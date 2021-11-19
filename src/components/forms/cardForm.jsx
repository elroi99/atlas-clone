import Box from "@mui/material/Box"
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ClearIcon from '@mui/icons-material/Clear';
import Paper from "@mui/material/Paper"
import { Typography } from "@material-ui/core";
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {useEffect} from "react";

// cardForm is a single form with multiple parts. the parts are called first,second,acknowlegement.
// i have used the controlled components approach. and split the form into 4 parts cardForm , first,second,acknowlegement.
// cardForm is the smart component with the state and the handling logic.
// cardForm (the smart container) is always rendered and first/second/acknowlegement are rendered conditionally depending upon where the user has reached in the form 
// think of first/second/acknowlegement as different pages in the form. 

// the cardFrom can be used in 2 modes. ie. the "addCard" mode and the "editCard" mode
// "addCard" mode --> will run the user through first,second, acknowlegement parts. This mode is supposed to provide ui to add a new card 
// "editCard" mode --> will run the user only through second, acknowlegement parts, with second part in editMode ie. editMode has save , delete buttons 

const CardForm = ({ handleDrawerClose , mode }) => {

    // this useEffect will run only once. ie. The first time the component renders.
        useEffect( () => {
        console.log("useEffect has been triggered")
        // read the description above
        // mistake below. changing state out in the open. bad bad bad. change it. useState or something. . .. 
        if(mode === "editCard"){
            setCurrentForm("second")
            // will skip the first part of the form and render the second directly
        }
        else{
            setCurrentForm("first")
        }
    } , []) 


    // tab change logic. powers the conditional rendering too. 
    let [ activeTab , activeTabSetter] = useState("single");    // decides the active tab ( in the first step)
    const [ colorState , setColorState ] = useState( { singleLineColor : "blue" , multiLineColor : "inherit"}); // does not work for now. 
    let [ currentForm , setCurrentForm] = useState("");    // determines which form step is being rendered
    const [ formValues , setFormValues ] = useState();          // consolidated localState for both the forms

    console.log(`current form is ${currentForm}`);

    let changeActiveTab = () => {
        ( activeTab === "single" ) ? activeTabSetter("multiple") : activeTabSetter("single");
        swapTabColors();
        console.log(activeTab);
    }

    let renderSecondForm = () => {
        setCurrentForm("second")
    }
    
    let renderAcknowlegement = () => {
        setCurrentForm("acknowlegement")
    }

    // this should work but isnt working for some reason. 
    let swapTabColors = () => {
        colorState.singleLineColor === "inherit" ? 
        setColorState({ singleLineColor : "inherit" , singleLineColor : "blue"}) : 
        setColorState({ singleLineColor : "blue" , multiLineColor : "inherit" })
        console.log(colorState.singleLineColor + " " + colorState.multiLineColor)
    }

    const handleClick = (e) => {
        e.preventDefault();
        console.log(e.currentTarget.dataset.formpart);
        if(e.currentTarget.dataset.formpart === "first"){
            renderSecondForm();
        }else if(e.currentTarget.dataset.formpart === "second"){
            renderAcknowlegement();
            // submit the data that we have collected in the loacal state to firebase. 
            let { link , bio} = formValues;
            console.log(link + "  ---- " + bio);
        }
    };

    let handleInputChange = (key , e) => {
        setFormValues({ ...formValues , [key] : e.currentTarget.value });
    }

    return (
        
        <Paper sx={{ p : 1 , width : "400px" , height : "500px" }}>
            <Box>
                <ClearIcon sx={{  display : "block", marginLeft : "auto" ,  }} onClick={ handleDrawerClose } />
            </Box>

                {/* at any point in time, only one of these three components will be rendered ie. conditional rendering by short circuiting conditionals           */}
                { ( (currentForm === "first") && <FirstStep handleInputChange = { handleInputChange } handleClick = { handleClick} changeActiveTab = { changeActiveTab } colorState = { colorState } activeTab = { activeTab }/> ) }
                { ( currentForm === "second" && <SecondStep handleInputChange = { handleInputChange } handleClick = { handleClick} editMode = "false" editMode ={ (mode === "editCard") ? "true" : "false" } /> ) }
                { ( currentForm === "acknowlegement" && <Acknowlegement/> ) }

        </Paper>
    )
        
}

let FirstStep = ({ changeActiveTab , colorState , activeTab , handleInputChange , handleClick }) => {

    return(
        <> 
            <Typography variant="h5" sx ={{ ml : 1}}> Add Cards </Typography>
            <Box sx={{ display : "flex"}}>
                {/* styling buttons does not seem to work for some reason */}
                <Button onClick={ changeActiveTab } sx={{ color : colorState.singleLineColor } } >  Add single link </Button> 
                <Button onClick={ changeActiveTab } sx={{ color :  colorState.multiLineColor  }} > Add multiple link</Button> 
            </Box> 

            <Box component="form" sx={{ display : "flex" , flexDirection : "column"}} >
                
                { 
                    (activeTab === "single") ? 
                    (<TextField 
                        id="outlined-basic" 
                        type="text" 
                        label="Paste Link Here " 
                        variant="outlined" 
                        size="small" 
                        sx={{ display:"block" , }} 
                        onChange = { (e) => { handleInputChange("link" , e) }  }
                        /> )  :
                    ( <TextField 
                        id="outlined-basic" 
                        multiline 
                        rows={6} 
                        label="Paste multiple links here, separated by spaces " 
                        variant="outlined" 
                        size="small" 
                        sx={{ display:"block" }}
                        onChange = { (e) => { handleInputChange("linkArr" , e) } } /> )
                } 
                
                <Button variant="contained" color="primary"  type="submit" data-formpart="first" onClick={ handleClick }>  Submit </Button>
            </Box>
        </> 
     )
}

let SecondStep = ({ handleClick , handleInputChange , editMode }) => {
    return( 
    <>
        <Box sx={{ width : "100%" , display : "flex" , flexDirection : "column", gap:"1rem"}}>
        { editMode === "true" ? <Typography variant="h6"> Edit your card details </Typography> : <Typography variant="h6"> Add details to your card </Typography>  }
        <TextField id="outlined-textarea" label="Card Title" variant="outlined" placeholder="" name="bio" onChange={ (e) => {handleInputChange("card title" , e ) } }/>
        <TextField id="outlined-textarea" label="Topics" variant="outlined" placeholder="" onChange={ (e) => {handleInputChange("topics" , e ) } } /> 
        <TextField id="outlined-textarea" label="People" variant="outlined" placeholder="" onChange={ (e) => {handleInputChange("people" , e ) } } /> 
        <TextField id="outlined-multiline-flexible" multiline  rows="5" label="Notes" variant="outlined" placeholder="" onChange={ (e) => {handleInputChange("notes" , e ) } } /> 
        {
            (editMode === "false") ?
            (<Button variant="contained" color="primary"  type="submit" data-formpart="second" onClick={  handleClick } >  Submit </Button>) 
            :
            (<Box sx={{ display : "flex" , justifyContent : "space-around" }}>
                <Button variant="contained"> 
                    Save 
                </Button>
                <Button variant="contained" startIcon={<DeleteOutlineOutlinedIcon/>}>
                    Delete
                </Button>
            </Box> )
        }
        </Box>
    </>)
}

let Acknowlegement =( ) => {
    return ( <Typography> Your card has been saved !! Congratulations ! </Typography> )
}
 
export default CardForm;