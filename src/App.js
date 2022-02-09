import Navbar from "./components/Navbar";
import Main from "./Pages/main";
import Queue from "./Pages/queue";
import Explore from "./Pages/explore"
import Author from "./Pages/author"
import Topic from "./Pages/topic"
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
import NotFound from "./Pages/notFound";
import FormsContext from "./contexts/formsContext"


let App = (props) => {

  return (
      <>  
      
        <Router> 
            <AuthContext >
             <FormsContext> 
                <Switch> 

                    <Route exact path="/" component={Landing} />  
                    <Route exact path="/unauthorized" component={ Unauthorized }/> 
                    <ProtectedRoute exact path="/main" component={Main} />  
                    <ProtectedRoute exact path="/queue" component={Queue} />  
                    <ProtectedRoute exact path="/explore" component={Explore} />  
                    
                    {/* Non Nav bar pages ( it always has to be visited wrt a particular author or topic uid ie. it always needs an accompanying uid param)  */}
                    <ProtectedRoute exact path="/author/:authorUid" component={ Author }  />
                    <ProtectedRoute exact path="/topic/:topicUid" component={ Topic }  /> 
                    {/* <Route exact path="*" component={ NotFound }/>  */}
                  
                </Switch>
                </FormsContext> 
              </AuthContext>
          </Router> 

      </>
  );
}

export default App;
