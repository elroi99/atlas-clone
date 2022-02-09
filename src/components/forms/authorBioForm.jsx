import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import { IconButton } from '@mui/material/';
import { useRef , useState , useContext , useEffect } from "react";
import { ConstructionOutlined } from '@mui/icons-material';
import { formsContext } from "../../contexts/formsContext";
import { authContext } from "../../contexts/authContext";
import { uploadBytes , ref , getDownloadURL  } from 'firebase/storage';
import { Author } from "../../firebase/firestoreProductionFunctions";
import { doc , collection , updateDoc , where , getDocs , query , setDoc  } from "firebase/firestore";
import { db } from "../../firebase/firebase"
import { storage } from "../../firebase/firebase";  // storage object created from 
import { v4 as uuidv4 } from 'uuid';

// userBioForm does not have different normal and editModes. the same "Save" submit button works.

const AuthorBioForm = ({handleDrawerClose}) => {
    console.log(" author Bio form is being displayed")
    let {closeForm , formProps : { authorUid  } } = useContext(formsContext);
    let { uid : userUid }  = useContext(authContext);  // renamind the uid as userId to avoid confusion between uid of the user and uid of an author
    console.log(`the userUid is ${userUid} and the current authorUid is ${authorUid}`)    // the renaming worked.
    const uploadAvatarRef = useRef(null);
    const uploadCoverRef = useRef(null);
    let [ formValues , setFormValues] = useState({ name : "" , bio : "" , avatar : "" , background : "" , twitter : "" , website : ""}); // local store of form inputs. 
    let [ acknowlegementVisibility , changeAcknowlegementVisibility] = useState(false); // determines if the form acknowlegement ie. the second formPart of the authorBioForm is visible or not.
    
    let displayAcknowlegement = () => {
        changeAcknowlegementVisibility(true);
    }
    //  formValues schema .... picked up from the Contructor in firestoreProductionFunction.
    //  all are strings. no nested arrays / objects etc. 
    // {
    //     name : name string,
    //     bio : bio string,
    //     avatar : avatarImage File API string ( user input) / blank when used to store data pulled from Firebase
    //     website : website string,
    //     twitter : twitter string,
    //     background : backgroundImage File API string / blank when used to store data pulled from Firebase
    //     uid : uid string,
    // }

    // think about this while naming the schema wrt avatar and background. the next time the user views an authorBioForm, he should be able to see a small verison of an image ie. this means that we will have to store the Firebase storage ref of the assets in the Author object
    // this is how it can go. when the user is entering stuff in the fields, the avatar and background will have the strings pulled form the File api. ie. the Windows path to the assets
    // once the user clicks submit, we will upload the assets into Firebase storage, get the refs to the storage and write this firebase ref to the Author object that we will set to Firestore 
    // think about this once again. -- think about the user flow. 
    // should we just name it avatar and background ?? cause they will be windows path and firstore ref at different points of time. get rid of the confusion.   
    
    // get the initial values of an author ( author details ) from Firebase after the first render.
    useEffect( () => {

        ( async () => {
            let authorData = (await getDocs( query(collection( db , "users" , userUid , "authorPool" ) , where( "uid" , "==" , authorUid )) )).docs[0].data();     // // change this. // the second uid in the where from a string to a variable 
            let { name , bio , avatar , website , twitter , background , uid } = authorData;
            console.log("initial author data pulled from Firebase ");
            console.log(authorData);
            setFormValues({ name , bio , avatar , website , twitter , background , uid  });

            // todo -- get the name of the assets from firebase storage. ( only once you create that component) 
        })();
        
    } , [])

    useEffect( () => {
        console.log("user input detected in authorBioForm, check its form state below")
        console.log(formValues)
    } , [ formValues])

    
    

    let handleChange = (e) => {
        if(e.currentTarget.name === "background"){
            console.log(e.currentTarget.name)
            setFormValues( { ...formValues , [ e.currentTarget.name] : uploadCoverRef.current.files[0]})
        }else if(e.currentTarget.name === "avatar"){
            console.log(e.currentTarget.name)
            setFormValues( { ...formValues , [ e.currentTarget.name] : uploadAvatarRef.current.files[0]})
        }else{
            console.log(e.currentTarget.name)
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
            
            if( formValues.avatar != undefined && formValues.avatar != "" && typeof formValues.avatar != "string"){
                try{
                    // if user has provided an avatar , upload the avatar to Firestore
                    // get the users uid situation set yo !! , then continue writing these functions 
                    let fileRef = ref( storage , `${userUid}/authorBioAssets/${authorUid}/avatar`)
                    let avatarStorageRef = (await uploadBytes( fileRef , formValues.avatar)).ref;
                    console.log(avatarStorageRef)
                    console.log("avatar set to Firebase storage successfully")
                    let avatarDownloadURL = await getDownloadURL(avatarStorageRef)
                    assetRefs.avatar = avatarDownloadURL; // storing in object instead of state.
                }
                catch(error){
                    console.log(error);
                    console.log("Error while trying to upload the avatar to Firebase")
                }

            }
            if(formValues.background != undefined && formValues.background != "" && typeof formValues.background != "string"){
                try{
                    // if user has provided an background , upload the background to Firestore
                    let fileRef = ref( storage , `${userUid}/authorBioAssets/${authorUid}/background`)
                    let backgroundStorageRef = ( await uploadBytes( fileRef , formValues.background)).ref;
                    console.log(backgroundStorageRef);
                    console.log("background set to Firebase storage successfully")
                    console.log("pulling path returned object. this path is enough to pull files from Firebase storage ")
                    let backgroundDownloadURL = await getDownloadURL( backgroundStorageRef)
                    assetRefs.background = backgroundDownloadURL; // look out for variable clash.
                }
                catch(error){
                    console.log(error);
                    console.log("Error while trying to upload the background to Firebase")
                }

            }
            const { name , bio , website , twitter , uid  } = formValues;       // pulling out values form formValues yo !!
            // an authors uid will never change ( it is a unique and constant identifier). 

            let updatedAuthorObj = Author({ 
                uid, 
                name , 
                bio , 
                background : ( assetRefs.background === "" ? formValues.background : assetRefs.background ) , 
                avatar : ( assetRefs.avatar === "" ? formValues.avatar : assetRefs.avatar ) , 
                twitter  , 
                website  })
            console.log("updated author fields created locally");
            console.log(updatedAuthorObj);
            
            try{
                // find the author that needs to be updated from the authorPool ( use uid). and then update it.
                let authorQuery = query(collection( db , "users" , userUid , "authorPool") , where( "uid" , "==" , authorUid ) );  
                let authorDocRef = (await getDocs(authorQuery)).docs[0].ref;    // check if the ref found is correct.
                await updateDoc(authorDocRef , updatedAuthorObj );
                console.log("successfully updated the Author document in firestore");
                displayAcknowlegement();   
                
            }
            catch(error){
                console.log(error);
                console.log("Error while trying to update the Author document in the author pool")
            }
     
            // update name in authorsArr of all the cards that have this author included.
        })()

    }

    return (
        <Box sx={{ padding : "0 1rem 0 1rem"}}>
            <Box sx={{ height : "2rem"}}> <CloseIcon onClick={ closeForm } sx={{ display : "block" , marginLeft : "auto"}} /> </Box>
            
            {
                acknowlegementVisibility === false 
                ? 
                <>
                    <Box className="formBox" component="form" sx={{ display : "grid" , gap : "1rem" , gridTemplateColumns : "1fr 1fr" , width : "450px"  }}>
                        
                        <TextField id="outlined-basic" label="Name" variant="outlined" placeholder="name" name="name" onChange={handleChange} value = { formValues.name} />
                        <TextField id="outlined-basic" label="Bio" variant="outlined" placeholder="" name="bio" onChange={handleChange} value = { formValues.bio} />
                        <TextField id="outlined-textarea" label="Website" variant="outlined" placeholder="" name="website" onChange={handleChange} value = { formValues.website}/>
                        <TextField id="outlined-textarea" label="Twitter" variant="outlined" placeholder="" name="twitter" onChange={handleChange} value = { formValues.twitter}/>
        
                        <Box sx={{ width : "100%" , height : "100%" , gridColumnStart : "1" , gridRowStart : "4"}}>
                            <input
                            ref={uploadAvatarRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleChange}
                            name="avatar"
                            />
                            <Button
                            onClick={() => uploadAvatarRef.current && uploadAvatarRef.current.click()}
                            variant="contained"
                            name="avatar"
                            >
                            Upload Avatar
                            </Button>
                        </Box>
                        
                        <Box sx={{ width : "100%" , height : "100%" , gridColumnStart : "2" , gridRowStart : "4" }}>
                            <input
                            ref={uploadCoverRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleChange}
                            name="background"
                            />
                            <Button
                            onClick={() => uploadCoverRef.current && uploadCoverRef.current.click()}
                            variant="contained"
                            name = "background"
                            >
                            Upload Background Image
                            </Button>
                        </Box>
        
        
                        <Button variant="contained" type="submit" sx={{ gridRowStart : "5"}} onClick={ (e) => { handleSubmit(e) } } > Save </Button>  
        
        
                    </Box> 
                </>
                : 
                <AuthorAcknowlegement/>
            }

        </Box>
    )
}

export default AuthorBioForm;


let AuthorAcknowlegement = () => {
        return ( 
            <Box sx={{ width : "100%" , height : "100%" , backgroundColor : "#ddddf348" ,  display : "flex" , justifyContent : "center" , alignItems : "center" ,  }}> 
                <Box 
                sx={{ 
                    display : "flex" , 
                    justifyContent : "center" , 
                    alignItems : "center" , 
                    borderRadius : "5px",
                    backgroundImage: "linear-gradient(to right, #904e95, #e96443)",
                    backgroundClip : "text",
                    textFillColor : "transparent",
                    backgroundColor : "black",
                    // background: rgb(131,58,180),
                    // background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 33%, rgba(252,176,69,1) 100%),
                    
                    // width : "80%"
                    width : "450px",
                    height : "300px",
                    }}> 

                    <Typography sx={{ fontSize : "2rem" , fontWeight : "600" , color : "#e0b3e6" , minWidth : "min-content"}}> 
                        Author Saved ! 
                    </Typography>
                
                </Box>
            </Box>
    )
}