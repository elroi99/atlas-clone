import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState , useContext } from "react";

const CardDeleteAcknowlegement = () => {
  // // state decides if the card delete acknowlegement snackbar is visible or not.
  // const [ cardDelAcknowlegementVisibility, setCardDelAcknowlegementVisibility] = useState(false);

  let [ open , setOpen] = useState(false);

  const handleClick = () => {
    // setCardDelAcknowlegementVisibility(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    // setCardDelAcknowlegementVisibility(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Button onClick={handleClick}>Open simple snackbar</Button>
      <Snackbar
        open= { open }
        // {open}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Card Deleted"
        action={action}
      />
    </div>
  );
}

export default CardDeleteAcknowlegement;


// const Yomama = () => {
//   return (
//   <> 
//     <p> This is yomama</p> 
//   </>   );
// }
 
// export default Yomama;