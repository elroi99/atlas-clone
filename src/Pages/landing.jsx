import { signInWithFirebase , signout , auth } from "../firebase/firebase";
import { getAuth, onAuthStateChanged , signOut }  from "firebase/auth";
import { authContext} from "../contexts/authContext";
import { useContext , useEffect } from "react";
import { useHistory } from "react-router-dom"
import { Typography , Button } from '@mui/material';

// you only see landing page when you are logged out. ie. you can only Log In from Landing
// conversely, you only see the other pages when you are logged in.
// you can only log in from the Navbar. 

const Landing = () => {

  let data = useContext(authContext); 
  
    const history = useHistory();
    function routeChange(){
        history.push("/author");
      }

    return (
    <> 
        <Typography variant="h3" gutterBottom> Landing page </Typography>
        <Button onClick = { () => { signInWithFirebase() } } > Login </Button>
        <Button onClick={ () => { signout() }}> Logout </Button> 
        
        
        { data ? 
        ( 
          <>
            <p> {data.uid}</p>
            <p>{ data.displayName }</p>
            <p> {data.email}</p>  
            {/* <Button onClick={ routeChange }> Redirect </Button>  */}
          </>
          ) : 
          <p> User is logged out</p>
        }

    
      </>   );
}
 
export default Landing;