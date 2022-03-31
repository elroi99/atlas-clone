const initializeApp = require("firebase/app/initializeApp");   // firebase initialize app object.

// not using this file for now. dragged and dropped the project to netlify.

exports.handler = async function (event, context) {
  console.log(event);
  console.log(context);

    // constructing firebase configObj from .env file
    let configObj =  {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID 
   }

   let firebaseApp = initializeApp(configObj);  // a sync fn.

    return {
      statusCode: 200,
      body: JSON.stringify(firebaseApp),
    };
  } 

