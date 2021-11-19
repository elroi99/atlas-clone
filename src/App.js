import Navbar from "./components/Navbar";
import Main from "./Pages/main";
import Queue from "./Pages/queue";
import Explore from "./Pages/explore"
import Author from "./Pages/author"
import {BrowserRouter as Router , Switch , Route} from "react-router-dom";
import CardForm from "./components/forms/cardForm";
import AuthorForm from "./components/forms/demoPage";
// import { auth } from "./firebase/firebase.js";
import { createContext } from "react";
import Landing from "./Pages/landing";
import { formControlUnstyledClasses } from "@mui/core";
import DemoPage from "./components/forms/demoPage";


export const authContext = createContext(); // mainly for auth

let App = (props) => {


  return (
      <>  
      {/* <authContext.Provider value={ auth } >  */}
        <Router> 
            <Navbar/>     {/* header will always show up ,the body keeps changing acc to route */}
          
            <Switch>      

              <Route exact path="/"> 
                <Main/>  
              </Route>

              <Route exact path="/queue"> 
                <Queue/> 
              </Route> 

              <Route exact path="/explore"> 
                <Explore/> 
              </Route>

              <Route exact path="/author"> 
                <Author/> 
              </Route> 

              <Route exact path="/demoPage"> 
                <DemoPage/> 
              </Route> 

              <Route exact path="/cardForm"> 
                <CardForm/> 
              </Route> 


              
            </Switch>
          </Router>
      {/* </authContext.Provider>  */}
      </>
  );
}

export default App;
