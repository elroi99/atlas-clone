import { React , useState } from 'react';
import { Autocomplete , TextField , Chip , Typography } from '@mui/material';
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { useEffect } from "react";
import { Card , addTagsToFirebase, getExistingTags , addAuthorsToFirebase , Tag , Author } from "../firebase/firestoreProductionFunctions";
import { shouldBeInQueue } from "./forms/cardForm.jsx";

const filter = createFilterOptions();

export const TopicAutocomplete = ({ formValues , setFormValues , optionsValues , setOptionsValues , inputValue , setInputValue }) => {
  let topicOptionsArr = optionsValues.tagsOptionsArr; // a list of available topics. 

  // just checking if adding and removing a tag actually works. It does. we cannot reliably do it outside useEffect because of the async nature of setState.
  // useEffect( () => {
  //   console.log(formValues.tagsArr)
  // } , [ formValues.tagsArr])

  // currently setup as controlled. turn it into uncontrolled once you figure out uncontrolled end to end. YO !!!!
    return (
    // uncontrolled mui autocomplete component 
    <Autocomplete
    multiple
    id="tags-filled"

    // in uncontrolled components, we do not have to provide an explicit value prop. ( cause uncontrolled ie. state is held internally)
    defaultValue={ formValues.tagsArr != null ? formValues.tagsArr.map( (tag) => (tag.name) ) : null }
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
      let tagsArrValue =  value.map( (tagName) => ({ name : tagName}) ); // reformatting to meet the predecided schema.
      
      setFormValues( {...formValues , tagsArr : tagsArrValue } );
     }}

    // options props start
    options={ topicOptionsArr.map( (tagObj) => (tagObj.name)) } // { name : "optionsPqr" , uid : er234dd }
    // getOptionLabel not needed //getOptionLabel={ (option) => (option) }  // this was the problem. works now. ( it was missing ) 

    // other props start
    freeSolo
    renderInput={(params) => (
      <TextField
        {...params}
        variant="filled"
        label="Topics"
        placeholder="Favorites"
      />
    )}
    />
    )
}

export default TopicAutocomplete;
