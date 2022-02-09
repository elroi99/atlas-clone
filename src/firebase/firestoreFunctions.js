import { collection, addDoc , deleteDoc , doc , setDoc , getDoc , getDocs , query , where , updateDoc , serverTimestamp , onSnapshot } from "firebase/firestore"; 
import { db } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import { chainPropTypes } from "@mui/utils";
import { storage } from "./firebase";
import { ref  , uploadBytes } from "firebase/storage";
import  displayPicPlaceholder from "../assets/displayPicPlaceholder.png"

// THIS IS A NON PRODUCTION FILE. I USED IT ONLY TO LEARN FIRESTORE. 

// the setup in this apps firestore has been changed. They routes ( docs and colls) in the code below will not work. 
// Do not call these function, they will mess the current production date 

// adding a collection "bobs" to a collecton "innerColl" ( notice that we can name the collection that we have added)
export const addCollectionToThird = ( async() => {
    let docRef = doc( db , "t5gtyEnJzSguMkEiediBwWA1uAc2", "third" , "innerColl" , "bobs" );
    console.log(docRef.id);
    await setDoc( docRef , { 
        bobby : "darin"
    })
})

// checking if a collection exists ( check if collection "nonExistent" exists)
export const checkIfCollectionExists = ( async() => {
    let collRef = collection( db , "t5gtyEnJzSguMkEiediBwWA1uAc2", "third" , "nonExistent" );
    const querySnapshot = await getDocs( collRef  );
    if(querySnapshot.docs.length === 0){
        console.log("Collection does not exist");
    }
})

// geting the value of a particular field from a document ( looking for the value of the key "new" within the doc "third")
export const getField = ( async() => {
    let docRef = await doc( db , "t5gtyEnJzSguMkEiediBwWA1uAc2", "third" );
    const docSnap = await getDoc(docRef);
    console.log(docSnap.get("new"));
})

// querying in firebase ( get the document that meets these criteria)
export const queryData = ( async() => {
    let qObj = query(collection(db , "t5gtyEnJzSguMkEiediBwWA1uAc2" ) ,  where( "new" , "==" , "yomama"));
    const querySnapshot = await getDocs(qObj);
    console.log(querySnapshot.docs[0].get("new"));
})

// server timestamp --- does not work. 
// export const queryDataExperiment = ( async() => {
//     let qObj = query(collection(db , "cards" ) ,  where( "authorName" , "==" , "Franz Kafka"));
//     const querySnap = await getDocs(qObj);  // querySnapshot
//     const QueryDocumentSnapshotArr = querySnap.docs; // Array<QueryDocumentSnapshot> // similar to Array<DocumentSnapshot> 
//     let QueryDocumentSnapShot = QueryDocumentSnapshotArr[0]; // QueryDocumentSnapShot
//     let tgtDocRef = QueryDocumentSnapShot.ref;
//     await updateDoc(tgtDocRef , { timestamp : serverTimestamp() })
// })();

// updating a document directly
export const updatestuff = ( async() => {
    let dr = doc( db , "t5gtyEnJzSguMkEiediBwWA1uAc2" , "third");
    await updateDoc( dr , { "newUpdate" : { first : "first" , second : "second"} } );
    let docObj = await getDoc(dr)
    console.log(docObj.data());
})

// update a document found by querying.
export const updateAfterQuery = ( async() => {
    let drQuery = query( collection(db , "t5gtyEnJzSguMkEiediBwWA1uAc2" ) , where("new" , "==" , "yomama"));
    const targetDoc = await getDocs(drQuery);   // querySnapshot
    let targetDocs = targetDoc.docs; // Array<QueryDocumentSnapshot> // similar to Array<DocumentSnapshot>         
    targetDocs.forEach( (tgt) => {
        console.log(tgt.ref);
    })
    // now that we have the docRef of the target doc, the update function can be used easily. a breeze. 
    
})


// Firstore Custom Objects  // the default values in the constructors arguments is part of js, not a firebase requirement. 
class Card{
    constructor( title = "" , url = "" , authorId = "" , authorName = "" ){
        this.title = title;
        this.url = url;
        this.authorId = authorId;
        this.authorName = authorName;
    }
}

// Firestore data converter
const cardConverter = {
    toFirestore : (card) => {
        return {
            title : card.title,
            url : card.url,
            authorId : card.authorId,
            authorName : card.authorName
            };
        },
        fromFirestore : (snapshot , options) => {
            const data = snapshot.data(options);
            return new Card(data.name , data.state , data.country);
        }
    }

// using custom Firestore Objects and a Firestore Data converter to add a doc.
const createCardUsingClass = ( async() => {
    const docRef = doc(db , "cards" , "firstCard").withConverter(cardConverter);
    await setDoc( docRef , new Card("How to train your dragon" , "https://www.google.com/" , "kafka123" , "Franz Kafka"  ))
    console.log("successfully set card using custom class")
})

const checkCollection = (async () => {
    console.log("listener attached")
    let collQuery = query(collection( db , "cards"));
    const unsub = onSnapshot( collQuery , (querySnapshot) => {
        querySnapshot.docs.forEach( (doc) => {
            doc.data();
        })
        unsub();
    } )
})

////////////////

// paths---- storage - authors - author1 - backgroundImage
//                                          - avatar
//                     - users - user1 - backgroundImage
//                                          - avatar
//                     -topics - topic1 - backgroundImage


// Using Firebase Storage 
// let imgRef = ref(storage , "authors" , "trialAuthor" , "displayPicPlaceholder.png"  );  // ref to base. 
// let file = displayPicPlaceholder;
// uploadBytes( imgRef , file).then( (snapshot) => {
//     console.log("uploaded a blob")
// })

// console.log(displayPicPlaceholder);

// update functions -- this refers to changin the values of fields ( inside a doc). update subcollections by getting their collRef and then writing data to them. 
// await updateDoc( containerDocRef , { "innerMa.first" : "Cranium" } )    // updated  -- updateDoc variant 1
// await updateDoc( containerDocRef , { "innerMa.gentlemen.bedfordshire.type" : "Police" } ) // updateDoc variant 1
// await updateDoc( containerDocRef , "innerMa.gentlemen.bedfordshire.type" , { "medecine" : "rest" , "ayurvedic" : "best"} ) // updateDoc variant 2
    

    













