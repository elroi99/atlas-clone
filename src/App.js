import Navbar from "./components/Navbar";
import Main from "./Pages/main";
import Queue from "./Pages/queue";
import Explore from "./Pages/explore"
import Author from "./Pages/author"
import {BrowserRouter as Router , Switch , Route} from "react-router-dom";
import CardForm from "./components/forms/cardForm";
import AuthorForm from "./components/forms/Forms";
// import { auth } from "./firebase/firebase.js";
import { createContext } from "react";
import Landing from "./Pages/landing";
import { formControlUnstyledClasses } from "@mui/core";
import DemoPage from "./components/forms/Forms";
import ProtectedRoute from "./components/protectedRoute";
import AuthContext from "./contexts/authContext";
import Unauthorized from "./Pages/unauthorized";
import NotFound from "./Pages/notFound"


let App = (props) => {

  return (
      <>  
      
        <Router> 
            <AuthContext >
              <Switch> 
                  
                <Route exact path="/" component={Landing} />  
                <Route exact path="/unauthorized" component={ Unauthorized }/> 
                <ProtectedRoute exact path="/author" component={ Author }  />
                <ProtectedRoute exact path="/main" component={Main} />  
                <ProtectedRoute exact path="/queue" component={Queue} />  
                <ProtectedRoute exact path="/explore" component={Explore} />  
                <Route exact path="*" component={ NotFound }/> 

              </Switch>
              </AuthContext>
          </Router> 

      </>
  );
}

export default App;
