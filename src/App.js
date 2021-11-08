import Navbar from "./components/Navbar";
import Main from "./components/main/main";
import Queue from "./components/queue";
import Explore from "./components/explore"
import ThemeEx from "./components/experiments/themeEx"  
import GridTrial from "./components/experiments/gridTrial"
import Author from "./components/author"
import {BrowserRouter as Router , Switch , Route} from "react-router-dom";
import CardForm from "./components/forms/cardForm";
import AuthorForm from "./components/forms/authorForm";


let App = (props) => {

  return (
      <>  
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

          <Route exact path="/authorForm"> 
            <AuthorForm/> 
          </Route> 

          <Route exact path="/cardForm"> 
            <CardForm/> 
          </Route> 


          
        </Switch>
      </Router>


      {/* <ThemeEx/>
      <GridTrial/> */}

      </>
  );
}

export default App;
