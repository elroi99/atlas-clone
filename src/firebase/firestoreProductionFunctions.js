import { storage , db  } from "./firebase";
import { ref , getBlob , getBytes } from "firebase/storage";
import { collection, addDoc , deleteDoc , doc , setDoc , getDoc , getDocs , query , where , updateDoc , serverTimestamp , onSnapshot } from "firebase/firestore"; 
import { v4 as uuidv4 } from 'uuid';

// LEARNING HOW TO USE FIRESTORE CUSTOM OBJECTS -- START 
// imp note : custom obj + withConverter works fine as long as none of your objects properties have another object as its value ie as long as no ----  let obj =  { first : { innerFirst : 1 , innerSecond : 2}}
// use the next (object literal) approach for such objects. ( IVE USED THIS APPROACH IN PRACTICE. CHECK IT OUT) -- this approach eliminates need for dataConverter interfaces

    // a custom class Bakra
    // export class Bakra{
    //     constructor(name = "" , color = "" , sound = "" ){
    //         this.name = name;
    //         // this.details = { color : color,
    //         //                 sound : sound };
    //         this.color = color;
    //         this.sound = sound;
    //     }
    // }

    // Firestore data converter for bakra
    // export const bakraConverter = {

    //         toFirestore : (bakra) => {
    //             return { name : bakra.name,
    //                     // details : { 
    //                     //         color : bakra.color ,
    //                     //         sound : bakra.sound 
    //                     //         }
    //                     color : bakra.color,
    //                     sound : bakra.sound,
    //                     }
    //                 },

    //         fromFirestore : (snapshot , options) => {
    //             const data = snapshot.data(options);
    //             return new Bakra(data.name , data.color , data.sound );
    //         }

    //     }

    // USING OUR SETUP TO ACTUALLY ADD THE OBJECT TO FIRESTORE ( CALL THE iife TO ACTUALLY ADD THE DATA )
    // (async () => {
    //     let docRef = doc(db , "randColl2xxerdds" , "revisionDoc"  ).withConverter(bakraConverter);
    //     ( await setDoc( docRef  , new Bakra("Marty" , "Brown" , "Bakra sounds !!") ) )
    //     console.log("Successfully set yo !! ")
    // })();

// LEARNING HOW TO USE FIRESTORE CUSTOM OBJECTS -- END


// Keep in mind the none of the functions below are constructors, they only act as constructors by manually creating an object (literal) and returning it. 

//Author 

// different values at different points of time in the background and avatar props
// when user fills the form, it will contain path the asset ( widows file sytem path)
// when the app queries the data from Firebase, it will be blank ( it is a button)
// its image will be visible in a thumbnail in a form ( yet to be implemented )
export function Author(  { name , bio="" , avatar="", website="" , twitter="" , background = "" , uid = ""}){
    return {
        name : name,
        bio : bio,
        avatar : avatar,
        website : website,
        twitter : twitter,
        background : background,
        uid : uid,
    }
}

// Tag 
// shouldnt all the default values be null ??? 
export function Tag({name="" , uid="" , bio="" , background="" }){
    return{
         name : name,
         uid : uid,
         bio : bio,
         background : background,
        }
}

// User 
// shouldnt all the default values be null ???
// no need of displayName in the User object schema. we will get the displayName from the authContext  
export function User( {userName="", uid ="" , bio ="" , avatar="" , background="" }){
    return{
        userName : userName,
        uid : uid,
        bio : bio,
        avatar : avatar,
        background : background,
    }
}

// Card
export function Card({ title = "" , url = "" , uid ="" , authorsArr = [ ] , timestamp="" , tagsArr= [ ] , inQueue=false , notes=""}){
    return{
        title : title,
        url : url,
        authorsArr : authorsArr,
        timestamp : timestamp,
        tagsArr : tagsArr,
        inQueue : inQueue,
        notes  : notes,
        uid : uid
    }
}
  
// FUNCTIONS ---------------------------------------------------------

// creates an author ie. adds it to the author pool and returns this authors id. ( not ref ( cause the id helps us during querying ie. filtering))
// create and get when an author does not exist in the author pool. // only get when the author already exists in the pool.
// make sure that you only pass this authors that you are sure dont exist

// takes in an array of tags, moulds it as necessary and sets it to Firebase. 
// contained the diffing algo too ie. an algo that will find only the newly created Tags 
// by nature, it is an async function.
// works, checked. the Promises.all() part was the main uncertainty.
// returns arr[newlyCreatedTagObjects .... ] and side effect -- creates the new tags and sets them to firebase
export async function addTagsToFirebase(formValues , optionsValues , userUid ){

    let tagsArr = formValues.tagsArr.map( (tag) => ({ ...tag , name : tag.name.trim() }) )   
    // these are the tags included by the user
    // we will trim() the value of the name key of the tag
    // this will not let eg. "business" be considered equal to "business   "
    let tagsOptionsArr = optionsValues.tagsOptionsArr; // all options from pool

    let newTagsArr = [ ];    // arr of included tags that do not exist ( they have to be created and set to Firebase tagsPool)

    // if no existing options.... all tags are new tags. 
    if(optionsValues == null){
        newTagsArr = tagsArr; 
    }
    // no tags selected by uesr...... dont do anything, just return.
    else if(tagsArr === [ ]){
        newTagsArr =  []; 
        return [ ]
    }
    // non edge case .... continue....
    else{
        tagsArr.forEach( (tagObj) => {
            if( tagsOptionsArr.find( (tagOption) => tagOption.name === tagObj.name) === undefined ){
                // if a tag from the tagsArr does not exist in the optionsArr , add it to NewTagsObjArr
                newTagsArr.push(tagObj);  
            }
        })
        console.log("New tags -- yet to be created");
        console.log(newTagsArr);
    }
    
   try{
    let newTagObjArr = [ ]; // init. will eventually  be filled with tagObjects. 
    
    await Promise.all( newTagsArr.map( (newTag) => {
        let tagObject = Tag({ name : newTag.name , uid : uuidv4() } );   // returns a formatted tag object 
        console.log("a Tag Object")
        console.log(tagObject);
        newTagObjArr.push(tagObject);
        return addDoc( collection( db , "users" ,userUid , "tagPool") , tagObject ); // setting the object to the 
         // addDoc returns a Promise
     }))
     // once the Promise.all() resolves
        console.log(`${newTagObjArr.length} new tags set to firebase`);
        console.log("newly created tags below");
        console.log(newTagObjArr);

        // once all the tags are set to Firebase, we return the stuff below. 
     return( newTagObjArr);  
   }
   catch(error){
        console.log(error);
   }
}

// will return an array of tags that already existed. ie. ones that need to be included. not created. 

export function getExistingTags( formValues , optionsValues ){
    // result needed --> existing inputs 
    let existingTags = formValues.tagsArr.map( (userInput) => {
        // if a userInput item already exists in the options array, include it, else, returned undefined. 
        // we will filter out the undefined later
        let match = undefined;  // assuming that the userInput does not already exist in the options
        for(let option of optionsValues.tagsOptionsArr){
            if(userInput.name === option.name){
                match = option; 
                break;
                // as soon as you find a userInput in the options arr, break.
            }
        }
        // if we dont find userInput in the options arr, it doesnt preexist. the match will still be undefined
        // match will be returned

        return match;
    })

    // filter out the undefined entries of the existing array
    existingTags = existingTags.filter( ( exTag) => exTag != undefined);
    return existingTags;
}


let tagsArr = [ { name : "business" , uid : "eee333xxx"} , { name : "self Help" , uid : "rrr333jjj"} , { name : "computing" , uid : "hhh555fff"}];
let tagOptionsArr = [ { name : "business" } , { name : "borat"} , { name : "I going to America"}];
// 1st option for calling the async function -- call the async fn in an async iife
// (async () => {
//     try{
//         await addTagsToFirebase(tagsArr , tagOptionsArr);
//         console.log("call successful, async fn in async iife style")
//     }
//     catch(error){
//         console.log(error)
//     }
// })

// second option for calling the async function -- promise style
// addTagsToFirebase(tagsArr).then(() => {console.log("call successful promise style") });

// takes in an array of authors and sets it to firebase.  
// the fn in exactly the same as the addTagsToFirebase fn. 
// call it in the exact same way.
// make sure that you only pass thqis authors that you are sure dont exist

// use this to manually set tags. yo!! . 
// ( async () => {
//     try{
//         let tagObject = Tag({name : "Pisciculture" , uid : uuidv4() });   // returns a formatted tag object  
//         console.log("Tag object created. view below")
//         console.log(tagObject);
//         let tagSetter = await addDoc( collection( db , "users" ,userUid , "tagPool") , tagObject );
//         console.log("set tag successfully to firebase");
//     }
//     catch(error){
//         console.log(error);
//     }
// })


// this function is wrong. update this to the code style of tags
export async function addAuthorsToFirebase(formValues , optionsValues , userUid ){

    let authorArr = formValues.authorsArr.map( (author) => ({ ...author , name : author.name.trim() }) );   // authors entered by the user
    // these are the authors included by the user
    // we will trim() the value of the name key of the tag
    // this will not let eg. "business" be considered equal to "business   "
    let authorOptionsArr = optionsValues.authorOptionsArr; // all options from pool
    
    let newAuthorArr = [ ];    // arr of included tags that do not exist ( they have to be created and set to Firebase tagsPool)

    // if no existing options.... all tags are new tags. 
    if(optionsValues == null){
        newAuthorArr = authorArr; 
    }
    // no tags selected by uesr...... dont do anything, just return blank array .
    else if(authorArr === [ ]){
        newAuthorArr = [ ]
        return newAuthorArr;
    }
    // non edge case .... continue....
    else{
        authorArr.forEach( (authorObj) => {
            if( authorOptionsArr.find( (authorOption) => authorOption.name === authorObj.name) === undefined ){
                // if a tag from the tagsArr does not exist in the optionsArr , add it to NewTagsObjArr
                newAuthorArr.push(authorObj); 
            }
        })
        console.log("New authors -- yet to be created");
        console.log(newAuthorArr);
    }
    
   try{
    let newAuthorObjArr = [ ]; // init. will eventually  be filled with tagObjects. 
    
    await Promise.all( newAuthorArr.map( (newAuthor) => {   
        let authorObject = Author({ name : newAuthor.name , uid : uuidv4() } );   // returns a formatted tag object 
        console.log("an author object")
        console.log(authorObject);
        newAuthorObjArr.push(authorObject);        // as compared to newAuthor
        return addDoc( collection( db , "users" , userUid , "authorPool") , authorObject ); // setting the object to the 
         // addDoc returns a Promise
     }))
     // once the Promise.all() resolves
        console.log(`${newAuthorObjArr.length} new authors set to firebase`);
        console.log("newly created authors below");
        console.log(newAuthorObjArr);

        // once all the tags are set to Firebase, we return the stuff below. 
     return( newAuthorObjArr);  
   }
   catch(error){
        console.log(error);
   }
}

// will return an array of authors that already existed. ie. ones that need to be included. not created. 

export function getExistingAuthors( formValues , optionsValues ){
    // result needed --> existing inputs 
    let existingAuthors = formValues.authorsArr.map( (userInput) => {
        // if a userInput item already exists in the options array, include it, else, returned undefined. 
        // we will filter out the undefined later
        let match = undefined;  // assuming that the userInput does not already exist in the options
        for(let option of optionsValues.authorOptionsArr){
            if(userInput.name === option.name){
                match = option; 
                break;
                // as soon as you find a userInput in the options arr, break.
            }
        }
        // if we dont find userInput in the options arr, it doesnt preexist. the match will still be undefined
        // match will be returned

        return match;
    })

    // filter out the undefined entries of the existing array
    existingAuthors = existingAuthors.filter( ( exAuthor) => exAuthor != undefined);
    return existingAuthors;
}

let authorsArr = [{ name : "Chetan Bhagat" , uid : "333mistakes"} , { name : "cslewis" , uid : "eelewisx33xxx"}];

// manually setting cards
// ( async () => {
//     console.log("Trying to set the card manually");
//     let aa = [ Author({ name : "Silvan" , uid : "12eeddxx"}) , Author({ name : "Chintu" , uid : "irun" })];
//     let ta = [ Tag({ name : "food" , uid : "234edde" }) , Tag({  name : "trees" , uid : "eddit2233" })];
//     let myCard = Card(
//         { url : "formValues" ,
//         title : "Eans Friends" , 
//         authorsArr : aa,
//         tagsArr : ta,
//         notes : "a note to Eans Friends yo!!",
//         inQueue : false}
//         )
//     console.log(myCard)
//     await setDoc (   (db , "users" , userUid , "cards" , "arandxxcard")  , myCard  );
//     console.log("a card set manually")
// })

// use this to manually set authors. yo!! . 
// ( async () => {
//     try{
//         let authorObject = Author({name : "Herman Melville" , uid : uuidv4() });   // returns a formatted tag object  
//         let authorSetter = await addDoc( collection( db , "users" ,userUid , "authorPool") , authorObject );
//         console.log("set author successfully to firebase");
//     }
//     catch(error){
//         console.log(error);
//     }
// })

// ( async () => {
//     try{
//         await addAuthorsToFirebase(authorsArr);
//         console.log("Done creating and setting new authors to firebase")
//     }
//     catch(error){
//         console.log(error);
//     }
// })()

// (async () => {
//     try{
//         await addAuthorsToFirebase(authorsArr);
//         console.log("call successful, async fn in async iife style")
//     }
//     catch(error){
//         console.log(error)
//     }
// })();

export async function updateTag(userUid){
    await getDocs( query( collection(db , "users" , userUid , "tagsPool") ,  ) )
}

export function updateAuthor(){
    
}

// removes the tag from the current cards tagList. card may get orphaned (moved into queue) if no tags are left 
// tag is retained in the tagPool
//  export function excludeTag(){
//     i dont think this is needed
// }

// removes the author from the current cards authorList. card may get orphaned (moved into queue) if no tags are left 
// author is retained in the tagPool
// export function excludeAuthor(){
//     i dont think this is needed 
// }

// deletes the author from the tag(topic) pool and removes it from all cards authorLists.
// orphans the cards that had it as the sole tag(topic) ie. such cards move into the queue 
export function deleteTag(){

}

// deletes the author from the author pool and removes it from all cards authorLists
// and orphans the cards that had that as the sole author ie. such cards move into the queue 
export function deleteAuthor(){
    
}

// deletes the card. warning shown by ui component ofc.
export async function deleteCard(userUid , cardUid){
    try{
        let xquery = query( collection( db , "users" , userUid , "cards") , where("uid" , "==" , cardUid) ) 
        let targetDocRef = (await getDocs( xquery)).docs[0].ref;

        await deleteDoc(targetDocRef);
        console.log(`${cardUid} card deleted successfully`)
    }
    catch(error){
        console.log(`could not delete card ${cardUid}`)
    }
}

// storage ref format userUid/author 
// export async function uploadFileToStorage(){
//     const mountainsRef = ref(storage, `${userUid}/`);
// }

// console.log(db);
// console.log(storage);

// testing how to pull files down from Firebase storage
// let trialRoute = "4qUcXB2StuhQ7wWQEY5cMLF4zP42/userBioAssets/background/IMG_20220124_170114_1.jpg"
// let storagePathRef = ref( storage , trialRoute);
// ( async() => {
//     let blobData = await getBlob( storagePathRef);
//     console.log(blobData)
// })(); 











