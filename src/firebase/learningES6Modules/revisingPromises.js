let axios = require("axios");

let returnsPromise = () => {
    return new Promise( (resolve , reject) => {
        setTimeout( () => { 
            console.log("Timeout Complete");
            resolve("Success -- this is the value")
    } , 3000)
    })
}

// let a = returnsPromise()
// console.log(a.result);

let fn = (async () => {
    console.log("before")
    await returnsPromise();
    console.log("Blocked yo !!")
})();