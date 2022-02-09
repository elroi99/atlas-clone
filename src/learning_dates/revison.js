let axios = require("axios");

function addTagsToFirebase(formValues , optionsValues ){

    let tagsArr = formValues.tagsArr;   // tags entered by the user
    let tagsOptionsArr = optionsValues.tagsOptionsArr; // all options from pool

   let newTagsArr = [ ];    // arr of included tags that do not exist ( they have to be created and set to Firebase tagsPool)
   tagsArr.forEach( (tagObj) => {
       if( tagsOptionsArr.find( (tagOption) => tagOption.name === tagObj.name) === undefined ){
           // if a tag from the tagsArr does not exist in the optionsArr , add it to NewTagsObjArr
           newTagsArr.push(tagObj); 
       }
   })
   console.log("New tags -- yet to be created")
   console.log(newTagsArr);

   let newTagObjArr = [ ];
   Promise.all( newTagsArr.map( (newTag) => {
       let tagObject = Tag({ name : newTag.name , uid : uuidv4() } );   // returns a formatted tag object 
       newTagObjArr.push(tagObj);
       return addDoc( collection( db , "users" ,"t5gtyEnJzSguMkEiediBw" , "tagPool") , tagObject ); // setting the object to the 
        // addDoc returns a Promise
    }))
   // once the Promise.all() resolves, this then() will run. 
   .then( () => {
       console.log(`${newTagObjArr.length} new tags set to firebase`);
       console.log("newly created tags below");
       console.log(newTagObjArr);
       // show acknowlegement yo !!!
       
   })
}


// defining the function -- 
function returnsPromise(){
    return new Promise((resolve , reject) => {
        resolve("Some shit")
    })
}


async function checkIfWebpageExists( url){
    try{
         let response = await axios.get(url);

         if(response.status != 200){
             console.log(`URL response status code is ${response.status} . Cant surely say that the URL provided by user is valid`);
             return false;
         }
         else{
             // url provided by user seems valid 
             console.log(`url provided by user is valid.`)
             // dont do anything. default errorObj state values will handle it.
         }
    }
    catch(error){
        console.log("error in checkIfWebpageExists -- Couldnt check if the webpage url is valid")
        console.log(error);
    }
}

// let mamu = (async () => {
//         let response = await axios.get("https://2ality.com/2012/09/expressions-vs-statements.htmldd");
//         return true;

// })()

// mamu.then( (bool) => {
//     console.log(bool);
// })

let trialArr = [ 
    { tagsArr : [ { name : "ean" } , { name : "elroi"} ]} , 
    { tagsArr : [ { name : "elroi" } , { name : "Vinu"} ]} , 
    { tagsArr : [ { name : "elroi" } , { name : "Vinu"} ]} 
]

function getCardsOfAuthor( cardsArr , author ){
    // returns an array of cardObjects. ie. ones that have the author listed in its authorArr
    let filtered = cardsArr.filter( ( cardObj ) => {
        // cardsArr expects a boolean
        let includeCard = false;    // assuming that the card does not include the current author
        
        for( let tagObj of cardObj.tagsArr ){
            if(tagObj.name === author){
                includeCard = true;
                break;
            }
        }

        return includeCard; // this will be true or false // when true, the current object will be included in the returned array by filter method. When false, it will be filtered out
    })

    return filtered;
}

let authorCards = getCardsOfAuthor(trialArr , "ean");
console.log(authorCards[0].tagsArr[0])


let c = [ 1 , 2 , 3].filter( (a) => true)
console.log(c)

function sortAccToTimestamp(cardsArr){
    cardsArr.sort( (firstCard , secondCard) => {
        if(firstCard.timestamp.seconds > secondCard.timestamp.seconds){
            //  second should be before first in the sorted array
            return 1;
        }
        else if( firstCard.timestamp.seconds < secondCard.timestamp.seconds){
            // first should be before second in the sorted array
            return -1;
        }else if(firstCard.timestamp.seconds === secondCard.timestamp.seconds){
            // both were made at the same time, maintain the original order ( stable sort)
            return 0;
        }
    })
  }

  let unsortedArr = [ { timestamp : { seconds : 400}}  , { timestamp : { seconds : 300}} , { timestamp : { seconds : 600}}  ];
  console.log(sortAccToTimestamp(unsortedArr));
  console.log(unsortedArr);


// works yo !! 
    function modifiedGetCardsOfAuthor( cardsArr , authorUid ){
        // returns an array of cardObjects. ie. ones that have the author listed in its authorArr
        
        let filtered = cardsArr.filter( ( cardObj ) => {
            // cardsArr expects a boolean
            let includeCard = false;    // assuming that the card does not include the current author
            
            for( let tagObj of cardObj.tagsArr ){
                if(tagObj.uid === authorUid){
                    includeCard = true;
                    break;
                }
            }

            return includeCard; // this will be true or false // when true, the current object will be included in the returned array by filter method. When false, it will be filtered out
        })

        return filtered;
    }

// sample cards yo!!!
let sampleCards = [ 
    { name : "Legend 1" , 
     tagsArr : [ { name : "ean" , uid : "112ess" } , { name : "elroi" , uid : "223xx"} ]
    }, 
    { name : "Legend 2" ,  
    tagsArr : [ { name : "elroi" , uid : "223xx" } , { name : "Vinu" , uid : "eedd44"} ] 
    },
    { name : "Legend 3" ,  
     tagsArr : [ { name : "elroi" , uid : "223xx" } , { name : "Anusha" , uid : "ppp33"} ] 
    },
]


let ready = modifiedGetCardsOfAuthor( sampleCards , "ppp33" );
console.log(ready);

