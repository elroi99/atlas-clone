import React , { useEffect , useRef } from 'react';
import { Autocomplete , TextField , Chip } from '@mui/material';
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';

export const AuthorAutocomplete = ({ formValues , setFormValues , optionsValues , setOptionsValues }) => {
   
  let authorsOptionsArr = optionsValues.authorOptionsArr;  
  console.log(authorsOptionsArr);
    // just checking if adding and removing a tag actually works. It does. we cannot reliably do it outside useEffect because of the async nature of setState. 
    // useEffect( () => {
    //   console.log(authorsOptionsArr)
    //   console.log(formValues.authorsArr)
    // } , [ formValues.authorsArr])

    return (
    // uncontrolled mui autocomplete component 
    <Autocomplete
    multiple
    id="tags-filled"

    // in uncontrolled components, we do not have to provide an explicit value prop. ( cause uncontrolled ie. state is held internally)
    defaultValue={ formValues.authorsArr != null ? formValues.authorsArr.map( (author) => (author.name) ) : null }
    renderTags={(value, getTagProps) =>
      value.map((option, index) => (
        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
      ))
    }
    onChange = { ( event , value , reason , details ) => { 
      // schema of value returned by autocomplete, in this case is [ optionName , optionName ] 
      // ie. an array of strings. 
      console.log("checking the schema of the value returned by autocomplete (authorAutocomplete) ")
      console.log(value);
      console.log("reformatting values yo !!");
      let authorsArrValue =  value.map( (authorName) => ({ name : authorName}) ); // reformatting to meet the predecided schema.
      
      setFormValues( {...formValues , authorsArr : authorsArrValue } );
     }}

    // options props start
    options={ optionsValues.authorOptionsArr.map( (authorObj) => (authorObj.name)) } // { name : "optionsPqr" , uid : er234dd }
    // getOptionLabel not needed //getOptionLabel={ (option) => (option) }  // this was the problem. works now. ( it was missing ) 

    // other props start
    freeSolo
    renderInput={(params) => (
      <TextField
        {...params}
        variant="filled"
        label="Authors"
        placeholder="Favorites"
      />
    )}
    />

)
}



export default AuthorAutocomplete;
