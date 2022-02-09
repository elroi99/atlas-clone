import * as React from 'react';
import { useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

export default function TitleAutocomplete({ formValues , setFormValues , optionsValues , setOptionsValues }) {
    let titleOptionsArr = optionsValues.titleOptions; // arr of title options.

    // just checking if adding and removing a tag actually works. It does. we cannot reliably do it outside useEffect because of the async nature of setState.
    // useEffect( () => {
    //   console.log(formValues.title)
    // } , [formValues.title])

    // titleOptionsArr.map((option) => option.title )
  
    return (
    <Autocomplete
      value={formValues.title}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setFormValues({
            ...formValues , 
            title: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          setFormValues({
            ...formValues,
            title: newValue.inputValue,
          });
        } else { 
          setFormValues({...formValues , newValue });
        }
            // check if it worksf
            console.log(formValues.authorsArr)
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      fullWidth = { true }
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={titleOptionsArr.map((option) => option.title )}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Title" />
      )}
    />
  );
}
