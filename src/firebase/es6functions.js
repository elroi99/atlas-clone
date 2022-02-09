// This is cheat sheet for ES6 Function parameter and argument syntax  Magic !!! 
// run this individual file using Node, not npm. In fact, dont run this. i havent checked if the code runs. 
// 2 resources were used for this ---> https://www.smashingmagazine.com/2016/07/how-to-use-arguments-and-parameters-in-ecmascript-6/       ----- over thorough and comprehensive
//                                ---> https://javascript.info/destructuring-assignment#smart-function-parameters

// ( covers passing params using spread operator  , ...rest syntax , default values of params , arguments object/arr , 
// arbitrary number of params , passing params in arbitrary order etc etc  )

// <!--Tip 1-->
// accept an arbitrary number of params using ...rest syntax
function acceptsArbitParams( first , second , ...rest){
    console.log(rest);
    // ...rest takes the all the passed params ( starting 3rd and combines them into an arr)
}

acceptsArbitParams("first" , "second" , "third" , "fourth" , "fifth");



// <!--Tip 2-->
// pass an arbitrary number of params using spread syntax ( notice the way we have called the function )
function experiment( ...rest){
    console.log(rest);
}

let p1 = [ "a" , "b" , "c" ,"d"];
let p2 = [ "one" , "two" , "three"]
experiment( ...p1 , ...p2);



// <!--Tip 3-->
// default values of parameters ( you have to pass the params in order as defined though)
function defaultParamEx( name = "Elroi" , age =20 , gender = "male" , happy = true , 
                        clickON = manualClickOn() , backupName = name , processedAge = age * 2 ){
    // do something with the params
    console.log(arguments);     // special object-arr(like) property that gets all the arguments passed to the function.
}
// notice how that in additon to the usual default values , a function too can be triggered if a particultr parameter value clickON in this case was omitted
// notice how a param can use another param as its default value ( backupName )
// we can also perform operations for the default value 

// notice how under this arrangemet, we had had to pass all the 4 params, even though 2 of them were undefined.
defaultParamEx( "Grace Potter" , undefined , "female" , undefined);
// notice how not passing all   params screws the intended functionality
defaultParamEx("Grace Potter" , "female" )


// <!--Tip 4.1-->
// picked this up from "javascript info modern js tut Smart function parameters" -- excellent yo
// arbitrary order (by passing params using object) , arbitrary number ( rest syntax)  
// fn receieves using the params + assigns default values using object destructring. 

//imp imp imp if we do not assign default values to a particular parameter and do not pass it while calling the function, it will give us a type error. 

// we pass this object to function
let params1 = {
    first : "first",
    third : "third",
    outofScope : "renegade",        // not destructured ( captured by ...rest)
    alsoUnexpected : "unexpected"   // not destructured ( captured by ...rest)
}

// ....... and it immediately expands it to variables
function passUsingObject({ first = "first" , second="defaultSecond" , third="default" , gender="male" , ...remaining}){
    console.log(`${first} ${second} ${third} ${gender}`)
    console.log(remaining);     // ...rest syntax 
}

passUsingObject(params1)

// imp if all params are supposed to be default
passUsingObject({}) // make sure you pass an empty object. passUsingObject() will give you an error

// tip 4.2
// want parameters to be optional ( without assigning them default values) ?? ........ give the entire object a default value of { } blank object
function initiateTransfer({protocol, port, delay, retries, timeout, log} = {}) {
    // code to initiate transfer
}
initiateTransfer();    // no error


