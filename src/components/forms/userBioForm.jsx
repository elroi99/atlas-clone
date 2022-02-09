import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import { IconButton } from '@mui/material/';
import { useState , useRef , useEffect , useContext } from "react";
import { ConstructionOutlined } from '@mui/icons-material';
import { formsContext } from "../../contexts/formsContext";
import { getStorage, ref , uploadBytes , getBlob  , getDownloadURL} from "firebase/storage";
import { doc , collection , updateDoc , where , getDocs , query, getDoc , setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"
import { storage } from "../../firebase/firebase";  // storage object created from 
import { authContext } from "../../contexts/authContext";
import { User } from "../../firebase/firestoreProductionFunctions"
import { v4 as uuidv4 } from 'uuid';
import { Typography} from '@mui/material';
// userBioForm does not have different normal and editModes. the same "Save" submit button works.

const UserBioForm = ({handleDrawerClose}) => {

    let { closeForm } = useContext(formsContext);
    let { uid : userUid , displayName } = useContext(authContext);

    const uploadAvatarRef = useRef(null);
    const uploadbackgroundRef = useRef(null);
    let [ formValues , setFormValues] = useState({ userName : "" , bio :"" , avatar:"" , background :""});
    // we get the userUid from authContext instead. 

    // formValues.avatar or formValues.background will at any point of time contain one of the two things . 
    // 1. a File object ( handleChange sets this)
    // 2. a downloadURL string to the avatar or background ( set inside the handleSubmit function after uploading the image to firebase storage)
    // this can and have caused a few bugs


    useEffect( () => {
        // get the initial values from firebase after first main page load
        (async() => {
            let userDoc =  ( await getDoc( doc(db , "users" , userUid) ) ).data()
            console.log(userDoc);
            let { userName , bio , avatar , background } = userDoc; 
            // we do not add displayName to state , we get it directly from authContext instead
            let userDocSubset = { userName , bio , avatar , background };
            setFormValues({ ...formValues , ...userDocSubset });
        })();
    }, [])

    // checking if the correct values have been set in formValues
    useEffect( () => {
        console.log("user input detected in userBioForm, check its form state below")
        console.log(formValues)
    } , [ formValues])

    // handling the change in the form inputs
    let handleChange = (e) => {
        if(e.currentTarget.name === "background"){
            console.log(e.currentTarget.name)
            // console.log(uploadbackgroundRef)
            setFormValues( { ...formValues , [ e.currentTarget.name] : uploadbackgroundRef.current.files[0]})
        }else if(e.currentTarget.name === "avatar"){
            console.log(e.currentTarget.name)
            setFormValues( { ...formValues , [ e.currentTarget.name] : uploadAvatarRef.current.files[0]})
        }else{
            setFormValues( { ...formValues , [ e.currentTarget.name] : e.currentTarget.value } )
        }
    }

    // when the submit button is pressed.
    // remember that the author object / document will always exist ( card creates it). everytime the submit button is clicked, you will be updating this object / document
    let handleSubmit = (e) => {
        // two parts .....
        // upload the assets ( avatar and background) to firebase storage (if the user has provided them) and get their refs
        // create the Author object and upload it to firestore
        e.preventDefault();

        ( async () => { 

            let assetRefs = { avatar : "" , background : "" }    // init a local object // poplated by the two uploadBytes below // at the end, it will contain the ref string of the image file in the Firebase storage. we need these strings to include them while modifyign the author
            
            // figuring out how to upload a file object to Firebase storage. 
            
            // Firebase storage routes
                // storage routes will look this --> `${{userUid}/${assetFolderName}/${assetName}/${imageName.jpg}" etc
                // assetFolder names can be userBioAssets or cardAssets or authorAssets
                // assetName can be avatar / background .... 

            if(formValues.avatar != undefined && formValues.avatar != "" && typeof formValues.avatar != "string" ){
                try{
                    // no need to delete the file currently in storage ( there can only be one avatar at a time) cause we use a generic name "avatarPic" at the end of the path. 
                    // the next time we write a file to this path , it will just be overridden. Thus, there will never be more than one file in the folder. 
                    
                    let fileRef = ref( storage , `${userUid}/userBioAssets/avatar` );  
                    let avatarSorageRef = ( await uploadBytes( fileRef , formValues.avatar)).ref; // is a Custom object 
                    console.log("avatar set to Firebase storage successfully")
                    let avatarDownloadURL = await getDownloadURL(avatarSorageRef); 
                    console.log("path received from getDownloadURL");
                    console.log(avatarDownloadURL);
                    // will eventually add this to the state , subsequent logic will add it to firebase.
                    assetRefs.avatar = avatarDownloadURL;   // storing it temporarily in an object -- we dont want to store it in a state cause that will cause an unnecessary Rerender.
                    console.log("avatar has been updated");
                }
                catch(error){
                    console.log(error)
                    console.log("Unsuccessfully tried to upload avatar photo to storage")
                }
            }
            if(formValues.background != undefined && formValues.background != "" && typeof formValues.background != "string"){
                try{                    
                    // look at the end of the path that we have passed to ref() notice that it is a generic backgroundPic instead of the actual name of the pic. This is for convenience ie. the next time we write a file to this path , it will overwrite the file. thus ridding us the need to first delete the file before uploading the next
                    let fileRef = ref( storage , `${userUid}/userBioAssets/background` );  // second param is a sting
                    let backgroundStorageRef = ( await uploadBytes( fileRef , formValues.background)).ref; // is a Custom object 
                    console.log(backgroundStorageRef)
                    console.log("background set to Firebase storage successfully")
                    let backgroundDownloadURL = await getDownloadURL(backgroundStorageRef)
                    console.log("path received from getDownloadURL");
                    console.log(backgroundDownloadURL);
                    // add the backgroundDownloadURL to firebase
                    // will eventually add this to the state , subsequent logic will add it to firebase.
                    assetRefs.background = backgroundDownloadURL;   // storing it temporarily in an object -- we dont want to store it in a state cause that will cause an unnecessary Rerender.
                    console.log("background has been updated");

                }
                catch(error){
                    console.log(error);
                    console.log("Unsuccessfully tried to upload background photo to storage")
                }
            }

            const { userName , bio , website , twitter  } = formValues;       // pulling out the non media values form formValues yo !!
            // we arent currently using bio , twitter or website fields
            
            // an authors uid will never change ( it is a unique and constant identifier). 
            let updatedUserObj = User({ 
                userName , 
                bio , 
                website , 
                twitter , 
                avatar :  ( assetRefs.avatar === "" ? formValues.avatar : assetRefs.avatar ) , 
                background :  ( assetRefs.background === "" ? formValues.background : assetRefs.background )  ,
            })

            

            try{
                let userDoc = await setDoc( doc(db , "users" , userUid ) , updatedUserObj);
                console.log("Updated the user object, view the updated object below")
                console.log(updatedUserObj);
            }
            catch(error){
                console.log("Error in updating the userBio information in firestore");
                console.log(error);
            }

        })()

    }

    return (
        <Box sx={{ padding : "0 1rem 0 1rem"}}>
            <Box sx={{ height : "2rem"}}> <CloseIcon onClick={ closeForm } sx={{ display : "block" , marginLeft : "auto"}} /> </Box>
            <Typography variant="h5" sx ={{ ml : 1 , mb : 1}}> Edit your profile </Typography>
            <Box className="formBox" component="form" sx={{ display : "grid" , gap : "1rem" , gridTemplateColumns : "1fr" , 
            // width : "450px"
              }}>
                <TextField 
                id="outlined-controlled" 
                label="userName" 
                variant="outlined" 
                placeholder="" 
                name="userName" 
                value={formValues.userName}
                autocomplete="off"
                onChange={(e) => { handleChange(e) }} 
                 />
                {/* <TextField id="outlined-basic" label="Last name" variant="outlined" placeholder="" name="lastName" onChange={handleChange} /> */}
                {/* <TextField id="outlined-basic" label="Email" variant="outlined" placeholder="" name="email" onChange={handleChange} /> */}
                {/* <TextField id="outlined-basic" label="User name" variant="outlined" placeholder="" name="userName" onChange={handleChange} /> */}
                <TextField 
                id="outlined-textarea" 
                label="Bio" 
                variant="outlined" 
                placeholder="" 
                name="bio" 
                value={ formValues.bio }
                autoComplete="off" 
                onChange={(e) => { handleChange(e) }}/>

                {/* upload avatar btn */}
                <Box sx={{ width : "100%" , height : "100%" , gridColumnStart : "1" , gridRowStart : "4"}}>
                    <input
                    ref={uploadAvatarRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => { handleChange(e) }}
                    name ="avatar"
                    />
                    <Button
                    onClick={() => uploadAvatarRef.current && uploadAvatarRef.current.click()}
                    variant="contained"
                    name="avatar"
                   
                    >
                    Upload Avatar
                    </Button>
                </Box>
                
                {/* upload background image button */}
                <Box sx={{ width : "100%" , height : "100%" , gridColumnStart : "2" , gridRowStart : "4" }}>
                    <input
                    ref={uploadbackgroundRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => { handleChange(e) }}
                    name = "background"
                    />
                    <Button
                    onClick={() => uploadbackgroundRef.current && uploadbackgroundRef.current.click()}
                    variant="contained"
                    name = "background"
                    >
                        Upload background Image
                    </Button>
                </Box>



                <Button 
                variant="contained" 
                type="submit" 
                sx={{ gridRowStart : "5"}} 
                onClick={ (e) => {  handleSubmit(e) } } >   
                    Save  
                </Button>  


            </Box> 
        </Box>
    )
}

export default UserBioForm;
