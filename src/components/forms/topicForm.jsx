import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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
import { Tag } from "../../firebase/firestoreProductionFunctions";
import { Typography , Stack } from '@mui/material';
// topicForm does not have different normal and editModes. the same "Save" submit button works.

const TopicForm = ({handleDrawerClose}) => {
    console.log("topicForm is being displayed");
    let {closeForm , formProps : {topicUid  } } = useContext(formsContext);
    let { uid : userUid }  = useContext(authContext);  // renamind the uid as userId to avoid confusion between uid of the user and uid of topic
    console.log(`the userUid is ${userUid} and the current topicUid is ${topicUid}`);    // the renaming worked.
    const uploadCoverRef = useRef(null);
    let [ formValues , setFormValues] = useState({ name : "" , bio : "" , background : "" }); // local store of form inputs. 
    let [ acknowlegementVisibility , changeAcknowlegementVisibility] = useState(false); // determines if the form acknowlegement ie. the second formPart of the authorBioForm is visible or not.
    
    let displayAcknowlegement = () => {
        changeAcknowlegementVisibility(true);
    }
    //  formValues schema .... picked up from the Contructor in firestoreProductionFunction.
    //  all are strings. no nested arrays / objects etc. 
    // {
    //     name : name string,
    //     bio : bio string,
    //     background : backgroundImage File API string / blank when used to store data pulled from Firebase
    //     uid : uid string,
    // }

    // think about this while naming the schema wrt avatar and background. the next time the user views an authorBioForm, he should be able to see a small verison of an image ie. this means that we will have to store the Firebase storage ref of the assets in the Author object
    // this is how it can go. when the user is entering stuff in the fields, the avatar and background will have the strings pulled form the File api. ie. the Windows path to the assets
    // once the user clicks submit, we will upload the assets into Firebase storage, get the refs to the storage and write this firebase ref to the Author object that we will set to Firestore 
    // think about this once again. -- think about the user flow. 
    // should we just name it avatar and background ?? cause they will be windows path and firstore ref at different points of time. get rid of the confusion.   
    
    // get the initial values of an topic ( topic details ) from Firebase after the first render.
    useEffect( () => {

        ( async () => {
            let topicData = (await getDocs( query(collection( db , "users" , userUid , "tagPool" ) , where( "uid" , "==" , topicUid )) )).docs[0].data();     // // change this. // the second uid in the where from a string to a variable 
            let { name , bio , background , uid } = topicData;
            console.log("initial topic data pulled from Firebase ");
            console.log(topicData);
            setFormValues({ name , bio , background , uid });

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
        }else{
            console.log(e.currentTarget.name)
            setFormValues( { ...formValues , [ e.currentTarget.name] : e.currentTarget.value } )
        }
    }

    // when the submit button is pressed.
    // remember that the topic object / document will always exist ( card creates it). everytime the submit button is clicked, you will be updating this object / document
    let handleSubmit = (e) => {
        // two parts .....
        // upload the asset (  background) to firebase storage (if the user has provided them) and get their refs
        // get the downloadURL to the asset ( using getDownlodURL ) and upload that to firestore.
        e.preventDefault();

        ( async () => {
            let assetRefs = { background : "" }    // init a local object // poplated by the two uploadBytes below // at the end, it will contain the ref string of the image file in the Firebase storage. we need these strings to include them while modifyign the author
            
            if(formValues.background != undefined && formValues.background != "" &&  typeof formValues.background != "string"){
                try{
                    // if user has provided an background , upload the background to Firestore
                    // TODO -- change this path think about it
                    let fileRef = ref( storage , `${userUid}/authorBioAssets/${topicUid}/background/`)
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
            const { name , bio , uid , background  } = formValues;       // pulling out values form formValues yo !!
            // an authors uid will never change ( it is a unique and constant identifier). 

            let updatedTopicObj = Tag({ 
                uid, 
                name , 
                bio , 
                background : ( assetRefs.background ?  assetRefs.background : formValues.background ) 
            })
            console.log("updated topic fields created locally");
            console.log(updatedTopicObj);
            
            try{
                // find the topic that needs to be updated from the topicPool ( use uid). and then update it.
                let topicQuery = query(collection( db , "users" , userUid , "tagPool") , where( "uid" , "==" , topicUid ) );  
                let topicDocRef = (await getDocs(topicQuery)).docs[0].ref;    // check if the ref found is correct.
                await updateDoc(topicDocRef , updatedTopicObj );
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
                    <Typography variant="h5" sx ={{ ml : 1 , pb : 1 , fontWeight : "500"}} > Topic Details </Typography> 
                    <Box className="formBox" component="form" sx={{ 
                        // display : "grid" , gap : "1rem" , gridTemplateColumns : "1fr 1fr" , width : "450px"  
                        minWidth : "300px"
                        }}>
                        
                        <Stack spacing={1.3}> 

                            <TextField id="outlined-basic" label="Topic name" variant="outlined" placeholder="name" name="name" onChange={handleChange} value = { formValues.name} />
                            <TextField id="outlined-basic" label="Description" variant="outlined" placeholder="" name="bio" onChange={handleChange} value = { formValues.bio} />

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


                            <Button variant="contained" type="submit"    onClick={ (e) => { handleSubmit(e) } } > Save </Button>  
                        </Stack>
                    </Box> 
                </>
                :
                <TopicAcknowlegement/>

            }

        </Box>
    )
}

export default TopicForm;


let TopicAcknowlegement = () => {
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
                width : "350px",
                height : "300px",
                }}> 

                <Typography sx={{ fontSize : "2rem" , fontWeight : "600" , color : "#e0b3e6" , minWidth : "min-content"}}> 
                    Topic Saved ! 
                </Typography>
            
            </Box>
        </Box>
)
}


