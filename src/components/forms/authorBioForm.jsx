import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import { IconButton } from '@material-ui/core';
import { useRef } from "react";
import { useState } from "react";
import { ConstructionOutlined } from '@mui/icons-material';


// userBioForm does not have different normal and editModes. the same "Save" submit button works.

const UserBioForm = ({handleDrawerClose}) => {

    const uploadAvatarRef = useRef(null);
    const uploadCoverRef = useRef(null);
    let [ formState , setFormState] = useState();
    // console.log(formState)
    

    let handleChange = (e) => {
        if(e.currentTarget.name === "coverImage"){
            console.log(e.currentTarget.name)
            setFormState( { ...formState , [ e.currentTarget.name] : uploadCoverRef.files[0]})
        }else if(e.currentTarget.name === "avatarImage"){
            console.log(e.currentTarget.name)
            setFormState( { ...formState , [ e.currentTarget.name] : uploadAvatarRef.files[0]})
            
        }else{
            setFormState( { ...formState , [ e.currentTarget.name] : e.currentTarget.value } )
        }
    }

    let handleSubmitBtnClick = (e) => {
        e.preventDefault();
        console.log(formState);
    }

    return (
        <Box sx={{ padding : "0 1rem 0 1rem"}}>
            <Box sx={{ height : "2rem"}}> <CloseIcon onClick={ handleDrawerClose } sx={{ display : "block" , marginLeft : "auto"}} /> </Box>
            <Box className="formBox" component="form" sx={{ display : "grid" , gap : "1rem" , gridTemplateColumns : "1fr 1fr" , width : "450px"  }}>
                <TextField id="outlined-basic" label="Name" variant="outlined" placeholder="" name="name " onChange={handleChange} />
                <TextField id="outlined-basic" label="Avatar" variant="outlined" placeholder="" name="avatar" onChange={handleChange} />
                <TextField id="outlined-basic" label="About" variant="outlined" placeholder="" name="about" onChange={handleChange} />
                <TextField id="outlined-textarea" label="Website" variant="outlined" placeholder="" name="website" onChange={handleChange}/>
                <TextField id="outlined-textarea" label="Twitter" variant="outlined" placeholder="" name="twitterLink" onChange={handleChange}/>

                {/* upload avatar btn */}
                <Box sx={{ width : "100%" , height : "100%" , gridColumnStart : "1" , gridRowStart : "4"}}>
                    <input
                    ref={uploadAvatarRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleChange}
                    />
                    <Button
                    onClick={() => uploadAvatarRef.current && uploadAvatarRef.current.click()}
                    variant="contained"
                    name="avatarImage"
                    >
                    Upload Avatar
                    </Button>
                </Box>
                
                {/* upload cover image button */}
                <Box sx={{ width : "100%" , height : "100%" , gridColumnStart : "2" , gridRowStart : "4" }}>
                    <input
                    ref={uploadCoverRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleChange}
                    />
                    <Button
                    onClick={() => uploadCoverRef.current && uploadCoverRef.current.click()}
                    variant="contained"
                    name = "coverImage"
                    >
                    Upload Background Image
                    </Button>
                </Box>



                <Button variant="contained" type="submit" sx={{ gridRowStart : "5"}} onClick={handleSubmitBtnClick} > Save </Button>  


            </Box> 
        </Box>
    )
}

export default UserBioForm;
