import Box from "@mui/material/Box"
import { useState , useContext , createContext } from "react";
import { TextField } from "@mui/material/";
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from "@mui/material/Paper"
import Typography from '@mui/material/Typography';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useEffect } from "react";
// import { createOrUpdateCard , Card } from "../../firebase/firestoreProductionFunctions";
import { authContext } from "../../contexts/authContext";
import { db } from "../../firebase/firebase"
import { getDocs , getDocsFromServer ,  doc , collection , query , where , addDoc ,  setDoc , updateDoc , getDoc , serverTimestamp } from "firebase/firestore"
import { formsContext } from "../../contexts/formsContext";
import { AuthorAutocomplete } from "../AuthorAutocomplete";
import { TopicAutocomplete } from "../TopicAutocomplete";
import TitleAutocomplete from "../TitleAutocomplete";
import { Card , addTagsToFirebase, getExistingTags , addAuthorsToFirebase , getExistingAuthors  , Tag , Author } from "../../firebase/firestoreProductionFunctions";
import { v4 as uuidv4 } from 'uuid';   
import  axios  from "axios";

// cardForm is a single form with multiple parts. the parts are called first,second,acknowlegement.
// i have used the controlled components approach. and split the form into 4 parts cardForm , first,second,acknowlegement.
// cardForm is the smart component with the state and the handling logic.
// cardForm (the smart container) is always rendered and first/second/acknowlegement are rendered conditionally depending upon where the user has reached in the form 
// think of first/second/acknowlegement as different pages in the form. 

// the cardFrom can be used in 2 modes. ie. the "add" mode and the "edit" mode
// "add" mode --> will run the user through first,second, acknowlegement parts. This mode is supposed to provide ui to add a new card 
// "edit" mode --> will run the user only through second, acknowlegement parts, with second part in editMode ie. editMode has save , delete buttons + no need to change the "Add a card" statement to "Edit card" cause it will be skipped altogether when the mode is "edit"

let formDataContext = createContext();

// will tell you if a card object is complete or not. ie. should it belong in the Queue or not.
export function shouldBeInQueue(formValues){
    // Objective --> 
    // pass the formValues of a card // the fields used to judge if a card is complete or incomplete. 
    // will return boolean ie. true / false. no side effects anywhere.
    let { title , tagsArr , authorsArr  } = formValues;
    let formValuesSubset = { title , tagsArr , authorsArr };
    console.log("This is the formValuesSubset");
    console.log(formValuesSubset);
    let inQueue = false;    // init. ie. assuming that the card is filled. 
    Object.keys(formValuesSubset).forEach( (key) => {
        if(formValuesSubset[key] == [ ] || formValuesSubset[key] == { } || formValuesSubset[key] == ""){
            inQueue = true; 
        } 
    })

    // just for logging -- just for the logs boi. 
    if(inQueue === false){
        console.log("Card Does not belong in Queue");
    }else{
        console.log("Card belongs in Queue");
    }

    return inQueue; // boolean return (false by default , true if a value is missing)
}

const CardForm = () => {

    let { uid : userUid } = useContext(authContext); 
    let { formProps , closeForm } = useContext(formsContext);
    let { formType , mode = "add" , editCardUid } = formProps;  // destructuring the formProps object that we get from the formsContext ( take a real close look at the schema ( in the formsContext file))

    // temp. data will actually be pulled from firebase
    // imp. this data does not represent the object that is to uploaded to firestore. this is just a dump. 
    let initFormValues = {  url : "" , 
                            urlsString : "",
                            title : "" , 
                            tagsArr : [  ] , 
                            authorsArr : [  ]
                        }

    // temp. data will actually be pulled from firebase
    // let initOptionsValues = {   
    //                             titleOptions : [ { title : "titleOption1" } , {title : "titleOption2"} ] , 
    //                             tagsOptionsArr : [  { title : "tagsOption1" } , {title : "tagsOption2"} ] ,
    //                             authorOptionsArr : [  { title : "authorOption1" } , {title : "authorOption2"} ] 
    //                         }

    let [ activeTab , activeTabSetter] = useState("single");    // decides the active tab ( in the first step)
    const [ colorState , setColorState ] = useState( { singleLineColor : "blue" , multiLineColor : "inherit"}); // does not work for now. 
    let [ currentPart , setCurrentPart] = useState();    // determines which form step is being rendered
    const [ cardExists , setCardExists] = useState();   // initial blank, when user submits url, the handleClick will check and set a boolean value
    const [ cardDocRefState , setCardDocRefState] = useState(); 
    // stores the reference of the card. 
    // write code such that both new and existing card cases will be handled
    
    // selected values. ie. for all fields of this form. 
    const [ formValues , setFormValues ] = useState(initFormValues);         
    // options for all fields of this form
    const [ optionsValues , setOptionsValues ] = useState(null);
    // optionsValues schema --> { titleOptions : [{ name : "" , uid : "" }],  tagsOptionsArr : [{ name : "" , uid : ""}] ,  authorOptionsArr  : [{ name : "" , uid : ""}] }
    const [ errorObj , setErrorObj ] = useState({ error : false , helperText : null });
    // checking if the activeTab state actually corelates with the 
    useEffect( () => {
        console.log(activeTab);
    } , [ activeTab ] )

    useEffect(() => {
        console.log(formValues.authorsArr)
    } , [formValues])

    // this useEffect will run only once. ie. after The first time the component renders.
    // this useEffect powers the difference between add and edit modes.
    useEffect( () => {
    // read the description above
    // will render the correct formPart ( second ) and set the editCards initial values to the formValues
    if(mode === "edit"){
        console.log("cardForm opened in editMode, first form part will be skipped ")
        setCurrentPart("second"); // will skip the first part of the form and render the second directly

        // getting the initial values of the card that needs to be edited.
        (async () => {
            let editCardData = (await getDocs ( query( collection( db , "users" , userUid , "cards") , where( "uid" , "==" , editCardUid ) ) ) ).docs[0].data();
            console.log(`card ${editCardUid} to be edited. view its data below`)

            //  setting the edit card's data to formValues
            let { url , title , authorsArr, tagsArr , inQueue , notes , uid } = editCardData;
            let dataPrepared = { url , title , authorsArr, tagsArr , inQueue , notes , uid };
            console.log(dataPrepared);
            setFormValues(dataPrepared)
        })();

    }
    else{
        setCurrentPart("first");
    }
    } , []) 

    // get the tags and authors (all the options) from their pools.   // useEffect runs once after the first render.
    useEffect( async () => {
        // get tags from Firebase , recast it into the needed format and set it in the correct state.  
        let tagPoolSnapshot = await getDocs( query( collection( db , "users" , userUid , "tagPool" )));
        let tagsRecasted = tagPoolSnapshot.docs.map( (tagOptionSnapshot) => {
            let { name  , uid } = tagOptionSnapshot.data();  // destructuring the real maal
            return { name , uid };   
        });

        // get authors from Firebase, recast it into the needed format and set it in the correct state.
        let authorPoolSnapshot = await getDocs( query( collection( db , "users" , userUid , "authorPool" )));
        let authorsRecasted = authorPoolSnapshot.docs.map( (authorOptionSnapshot ) => {
            let { name  , uid } = authorOptionSnapshot.data();  // destructuring the real maal
            return { name , uid };   
        });

        console.log("Tags (topics) and authors pulled from Firebase and added to the state, look at the state below")
        setOptionsValues({tagsOptionsArr : tagsRecasted , authorOptionsArr : authorsRecasted})
    } , [])

    // returns null if card does not exist. returns cardDocSnapshot is the card exits
    // this is used indirectly only to populate the initial card data in the form. ie. regerdless if the card exists or not
    // this function does not help in any way with the updating or creating a card
    let checkIfCardExists = async (url) => {
        let cardQuery = query( collection( db , "users" , userUid , "cards") , where("url" , "==" , url.trim()));
        let querySnapshot = await getDocs( cardQuery );
        console.log(querySnapshot.docs[0]); // checking the response.

        if(querySnapshot.empty === true){
            console.log("Matching card does not exist. ")
            return null;
        }
        // no side effect. only a return data. 
        else{   
            if(querySnapshot.docs.length === 1){
                console.log("Matching Card exists")
                console.log(querySnapshot.docs[0].data());    // printing from inside fn checkIfCardExits
                // returns the data we need
                return( querySnapshot.docs[0] );
            }
            else if(querySnapshot.docs.length > 1){
                console.log("Multiple matching cards found. Not sure what to do");  
            }
        }
    }

    let changeActiveTab = () => {
        ( activeTab === "single" ) ? activeTabSetter("multiple") : activeTabSetter("single");
        // swapTabColors();
        console.log(activeTab);
    }

    let renderSecondForm = () => {
        setCurrentPart("second")
    }
    
    let renderAcknowlegement = () => {
        setCurrentPart("acknowlegement")
    }

    // this should work but isnt working for some reason. 
    // let swapTabColors = () => {
    //     colorState.singleLineColor === "inherit" ? 
    //     setColorState({ singleLineColor : "inherit" , singleLineColor : "blue"}) : 
    //     setColorState({ singleLineColor : "blue" , multiLineColor : "inherit" })
    //     console.log(colorState.singleLineColor + " " + colorState.multiLineColor)
    // }

    // sets the initial values of the 2nd formPart based on the url entered by the user in the 1st formPart
    // in case of multiple url's, the 2nd formPart is skipped altogether , all cards created will be put in the queue.
    
    // handles the final submission yo !!
    const handleClick = async (e) => {      
        console.log("Handle click clicked");
        e.preventDefault();
        console.log(e.currentTarget.dataset.formpart);  // prints the part of the form currently being displayed on the screen
        let url = formValues.url;

        if(e.currentTarget.dataset.formpart === "first"){
            // user submitted the url

            console.log("inside form first part");
            
            // if user has entered multiple url's separated by space, parse them into individual url's and push them into the urlArr. 
            if(formValues.urlsString != undefined && formValues.urlsString != "" ){
                console.log("inside handle click, multiple url's entered");
                // parse the urlsString and load the results into the urlArr. 
                let urlArr = formValues.urlsString.split(/\s+/);
                // do not display the second part, directly the acknowlegement
                // you also have to create cards out of these url's 
                console.log("Printing the urls");
                console.log(urlArr);

                let cardPromiseArr = Promise.all (urlArr.map( (url) => {
                    return checkIfCardExists(url.trim())
                    .then((doesCardExist) => {
                        // if card does not exist ( read the return signature of "checkIfCardExists")
                        if(doesCardExist === null){
                            let newlyCreatedCard = Card({ url , uid : uuidv4() , timestamp : serverTimestamp() , inQueue : true })
                            addDoc( collection(db , "users" , userUid , "cards" ) , newlyCreatedCard )
                            .then((createdCardDocRef) => {
                                // since another card has been created, increment the success counter
                            }).catch((error) => {
                                console.log(`card ${url} couldnt be created because of the below error`)
                                console.log(error);
                            })
                        }
                        // card already exists, it need not be created
                        else{
                            console.log(`${url} card already exists, no need to create it`)
                        }
                        
                    })
                }) 
                )
                // once the Promise.all() resolves
                cardPromiseArr.then( () => {
                    // add some sort of summary statement to show how many cards have been created and how many failed.

                    // display the acknowlegement
                    renderAcknowlegement();  
                })
            }
            else{
            // objective -->  
            // inside this "if" block. we will only set the initial values of the form fields.
            // case 1-- a card already exists, get the card data from firebase and put it into the correct fields of the formValue state
            // case 2 -- if a card doesnt already exist, dont do anything ( the default value of the formFields state will give the formValue ( ie. all the form Fields) the correct initial values ie. blank)

                console.log("inside handle click, single url entered");
                // user has entered a single url. 

            // if the url entered is not undefined or ""                                
                if(url != undefined  && url != "" ){
                    let cardDocSnap = await checkIfCardExists( formValues.url.trim() );
                    console.log("Querying firebase for a card url");
                    console.log("results of the query");
                    console.log(cardDocSnap);   // prinitng from outisde the conditions. ( inside handleClick part 1)
    
                    // card doesnt exist
                    if(cardDocSnap === null){
                        // card doesnt already exist. this function only sets the initial (default) formValues. 
                        // dont create a new card here. you dont have to do anything, the default state will take care of this situation
                    
                        // think about it and add this code yo !!
                        // if(validUrl){

                        // }else{

                        // }

                        console.log("card did not exist, since this function is only responsible for setting the states initial values ( for the initial values of the form fields) , do not create a card. in fact, dont do anything, the default state value will handle this");   
                    }
                    // card exists
                    else{
                        // card already exists. get the card data from firebase and set the initial fields of the form. ie. by setting the formValues 
                        let { url , title , authorsArr, tagsArr , inQueue , notes , uid } = cardDocSnap.data();  
                        console.log("The url returned by the query")
                        console.log(url);
                        let foundCardData = { url , title , authorsArr , tagsArr , inQueue , notes , uid };
                        setFormValues( foundCardData ); // effectively sets initial values 
                        console.log(foundCardData); // check if all the data we currently have has been set. 
                    }
                    renderSecondForm(); // second will not render if the 
                }
                // if the url entered is blank or undefined. 
                else{
                    // objective --> 
                    // if url is blank or undefined, a query is not needed at all. 
                    console.log("Blank or undefined url entered");
                      
                }
            }

        }else if(e.currentTarget.dataset.formpart === "second"){
            // objective --> 
            // powers the submit button of the second part of the form. 
            // ( prerequisite ) Get the value of the AuthorAutocomplete and the Tags Autocomplete -- should this be here ?? or let the autocompletes update the state on onChange ??
            // Clicking the submit button will actually create a card / update a card. 
            // find whether a card already exists by running a query on the cards collection. 
            // the initial values will have already been loaded by the previous block of code. 
            // this block of code will actually create / update the card in the database.
            
            (   async () => {
            let { url , title , 
                // authorsArr, tagsArr , 
                inQueue , notes , uid : cardUid } = formValues;   // pulling the values out. 

                let cardQuerySnapshot = await getDocs ( query( collection(db , "users" , userUid , "cards") , where("url" , "==" , formValues.url) ) )
                
                // get all the included tags and authors. separate the ones that existed from the ones that did not exist before. 
                // create the ones that did not exist before and set them to firebase
                // separate the ones that already existed 
                // we will use both while creating/ editing the card

                // tags
                let existingTagsArr = getExistingTags(formValues , optionsValues);
                // create the tags that do not already exist, set them to Firebase and get those newly created tags.
                let newlyCreatedTagsArr = await addTagsToFirebase( formValues , optionsValues , userUid);
                let includedTags = [ ...existingTagsArr , ...newlyCreatedTagsArr]; // contains objects of all the tags that the user included in the card

                // authors -- uncomment this
                let existingAuthorsArr = getExistingAuthors(formValues , optionsValues);
                // create the authors  that do not already exists, set them to Firebase and put created authors in an array .
                let newlyCreatedAuthorsArr = await addAuthorsToFirebase(formValues , optionsValues , userUid );
                let includedAuthors = [ ...existingAuthorsArr , ...newlyCreatedAuthorsArr ];    // contains objects of all the authors that the user included in the card
                console.log("includedAuthors");
                console.log(includedAuthors);

                // if empty, create a new card
                if(cardQuerySnapshot.empty === true){
                    //objective --> 
                    // if empty, ie card does not exist
                    // at this point in the code, includedTags and includedAuthors arrays contain the objects of the tags and authors respectively ( previous code has created, set them in firebase as needed)
                    // use includedTags and includedAuthors while creating a card 
                    // create a new card ( make sure all authors and tags selected by the user are added in the card )
                
                    let newCard = Card({ url , title , authorsArr : includedAuthors, tagsArr : includedTags, inQueue : shouldBeInQueue(formValues) , notes , timestamp : serverTimestamp() , uid : uuidv4() }); // card created locally. 
                    console.log("new card object created locally. view the card object below");
                    console.log(newCard);

                    // the newly created tags, authors have already been set to Firebase by the addTagsToFirebase , addAuthorsToFirebase
                    // no need to set them again.  
                    try{
                        // setting card
                        let cardRef = await addDoc (collection(db , "users" , userUid , "cards" )  , newCard  );
                        console.log("newly created card set to cards, querying to check if the card has been set properly");
                        console.log( (await getDoc(cardRef)).data() ); 
                    }catch(error){
                        // dont do shit. 
                    }
                }
                // if not empty, edit the card.
                else{
                    
                    // we are executing this query because we want the firestore ref to the card that is being updated.  -- we arent really interested in the data ie. just for logs.
                    let editCardDocumentSnapshot = (await getDocs ( query( collection(db , "users" , userUid , "cards") , where("uid" , "==" , editCardUid) ) )).docs[0];
                    let editCardRef = editCardDocumentSnapshot.ref;
                    let editCardData = editCardDocumentSnapshot.data();
                    console.log("Card with uid ${editCardUid} is to be edited, displaying its firestore ref and data below");   // only to 
                    console.log(editCardRef);
                    console.log(editCardData);

                    // creates an updated card locally. 
                    let updatedCard = { 
                        url , 
                        title , 
                        authorsArr : includedAuthors, 
                        tagsArr : includedTags , 
                        inQueue : shouldBeInQueue(formValues) , 
                        notes , 
                    }; // updated card created locally. 

                    console.log("updated card created locally, check if out below");
                    console.log({ ...formValues , ...updatedCard } );
                    
                    // setting the changes to Firebase
                    // kuch to locha hai. logic galat hai . soch le. flawed logic. 
                    await updateDoc( editCardRef , { ...formValues , ...updatedCard } ); // will pretty much override the whole card. thus updating it.
                    console.log(`card ${editCardUid} Updated successfully`)
                }
            })().then( () => {
                renderAcknowlegement();
                // submit the data that we have collected in the loacal state to firebase.
            }).catch((error) => {
                console.log(error);
                console.log("error while updating the card")
            })
 
        }
    };

    let handleInputChange = (key , e) => {
            // handleInputChange will run for every field in the cardForm including url.
            setFormValues({ ...formValues , [key] : e.target.value });
    }

    // this needs to be called from a server. ie. use a firebase cloud functions 
    async function checkIfWebpageExists( url){
        try{
             let response = await axios.get(url);
             // if the url passed is invalid, axios will throw a tantrum. ie. an error / exception , which will be caught by our catch block
             // the next line will not run at all
             // thats how we will know that the url is invalid

             // url provided by user seems valid 
             console.log(`url provided by user is valid.`)
             // dont do anything. default errorObj state values will handle it.

        }
        catch(error){
            console.log(error);     // check the error
        }
    }

    // testing checkIfWebpageExists yo !!!
    // checkIfWebpageExists("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions").then( ( bool) => console.log(bool) )

    return (
        <formDataContext.Provider value={{  }}>
        <Paper sx={{ p : 1 , width : "400px" , height : "500px" , overflow : "hidden" }}>
            <Box>
                <ClearIcon sx={{  display : "block", marginLeft : "auto" ,  }} onClick={ () => { closeForm() } } />
            </Box>

                {/* at any point in time, only one of these three components will be rendered ie. conditional rendering by short circuiting conditionals           */}
                { ( 
                    (currentPart === "first") 
                    && 
                    <FirstStep 
                        handleInputChange = { handleInputChange } 
                        handleClick = { handleClick} 
                        changeActiveTab = { changeActiveTab }
                        colorState = { colorState } 
                        activeTab = { activeTab } 
                        formValues = {formValues}
                        setFormValues = { setFormValues}
                        optionsValues = { optionsValues}
                        setOptionsValues = { setOptionsValues}
                        errorObj = { errorObj }
                        /> 
                        
                ) }
                { ( 
                        ( currentPart === "second" ) 
                        && 
                        (optionsValues != undefined)
                        && 
                        <SecondStep 
                            handleInputChange = { handleInputChange } 
                            handleClick = { handleClick} 
                            editMode = "false" 
                            editMode ={ (mode === "editCard") ? "true" : "false" } 
                            formValues = {formValues}
                            setFormValues = { setFormValues}
                            optionsValues = { optionsValues}
                            setOptionsValues = { setOptionsValues} 
                            errorObj = { errorObj }
                            /> 
                ) }
                { ( currentPart === "acknowlegement" && <Acknowlegement/> ) }

        </Paper>
        </formDataContext.Provider>
    )
        
}

let FirstStep = ({ changeActiveTab , colorState , activeTab , handleInputChange , handleClick , formValues , setFormValues , optionsValues , setOptionsValues , errorObj  }) => {

    return(
        <> 
            <Typography variant="h5" sx ={{ ml : 1}}>  Add Cards   </Typography>
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
                        value={ formValues.url }
                        sx={{ display:"block" , }} 
                        onChange = { (e) => { handleInputChange("url" , e) }  }
                        error ={ errorObj.error }
                        helperText = { errorObj.helperText }
                        /> )  :
                    ( <TextField 
                        id="outlined-basic" 
                        multiline 
                        rows={6} 
                        label="Paste multiple links here, separated by spaces " 
                        variant="outlined" 
                        size="small" 
                        value={ formValues.urlsString }
                        sx={{ display:"block" }}
                        onChange = { (e) => { handleInputChange("urlsString" , e) ; console.log(formValues.urls) } } 
                        error ={ errorObj.error }
                        helperText = { errorObj.helperText }
                        /> )
                } 
                
                <Button variant="contained" color="primary"  type="submit" data-formpart="first" onClick={ handleClick } sx={{ marginTop : "1em"}}>  Submit </Button>
            </Box>
        </> 
     )
}

let SecondStep = ({ handleClick , handleInputChange , editMode , formValues , setFormValues , optionsValues , setOptionsValues , inputValue , setInputValue }) => {
    return( 
    <>
        <Box sx={{ width : "100%" , display : "flex" , flexDirection : "column", gap:"1rem"}}>
        { editMode === "true" ? <Typography variant="h6"> Edit your card details </Typography> : <Typography variant="h6"> Add details to your card </Typography>  }
        {/* <TitleAutocomplete 
        formValues = {formValues}
        setFormValues = { setFormValues}
        optionsValues = { optionsValues}
        setOptionsValues = { setOptionsValues} 
         /> */}

        {/* title field will not have autocomplete. it will be a nornal text field */}
        <TextField label="Title" value={ formValues.title} onChange ={ (e) => { setFormValues({ ...formValues , title : e.currentTarget.value })} } />
        <TopicAutocomplete 
        formValues = { formValues }
        setFormValues = { setFormValues}
        optionsValues = { optionsValues}
        setOptionsValues = { setOptionsValues} 
        inputValue = { inputValue }
        setInputValue = { setInputValue }
        />
        <AuthorAutocomplete 
        formValues = {formValues}
        setFormValues = { setFormValues}
        optionsValues = { optionsValues}
        setOptionsValues = { setOptionsValues} 
        inputValue = { inputValue }
        setInputValue = { setInputValue }
        />
        <TextField id="outlined-multiline-flexible" multiline  rows="5" label="Notes" variant="outlined" placeholder="" value={formValues.notes} onChange={ (e) => {handleInputChange("notes" , e ) } } /> 
        {
            (editMode === "false") ?
            (<Button variant="contained" color="primary"  type="submit" data-formpart="second" onClick={  handleClick  } >  Submit </Button>) 
            :
            (<Box sx={{ display : "flex" , justifyContent : "space-around" }}>
                <Button variant="contained" onClick = { handleClick }> 
                    Save 
                </Button>
                <Button variant="contained" startIcon={<DeleteOutlineOutlinedIcon/>}>
                    Cancel
                </Button>
            </Box> )
        }
        </Box>
    </>)
}

let Acknowlegement = ( ) => {
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
                    
                    width : "80%"
                    }}> 

                    <Typography sx={{ fontSize : "2rem" , fontWeight : "600" , color : "#e0b3e6" , minWidth : "min-content"}}> 
                        Saved ! 
                    </Typography>
                
                </Box>
            </Box>
    )
}
 
export default CardForm;