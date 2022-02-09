import  axios  from "axios";
import  { Readability , isProbablyReaderable }  from "@mozilla/readability";

export const a = "a constant";
 
async function getMarkup( url){
    try{
        let response =  await axios.get(url);
        console.log(response)
        return response;
    }
    catch(error){
        console.log("couldnt get markup of card url")
        console.log(error);
    }
    
}

let url = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
// https://dev.to/ramonak/javascript-how-to-access-the-return-value-of-a-promise-object-1bck            // seems to be less secure 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

// the page html turned into a document. ( readibility js needs document object as an input)
// calling the async getMarkup function and returning its value
// let pageDocument = getMarkup(url).then((response) => {
//     console.log("got the response, started parsing the page to make it readable.");
//     let htmlSting = response.data;
//     const pageDocument = new DOMParser().parseFromString(htmlSting , 'text/html');

//     // check if the page is readable
//     if(isProbablyReaderable(pageDocument) == false ){
//         console.log("Page is probably not readable");
//     }else{
//         // getting the readable page (reader mode )HTML
//         var pageDocumentClone = pageDocument;   // this isnt a clone, change this line to actually clone the object
//         var readablePageObject = new Readability(pageDocumentClone).parse();
//         // check github @mozilla/readability to understand the object schema and meaning.
//         console.log(readablePageObject.content);    // html of readable content. 
//     }

// }).catch((error) => {
//     console.log(error);
// })  























