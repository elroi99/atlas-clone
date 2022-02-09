import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { formsContext } from '../../contexts/formsContext';
import { useContext } from "react"
import { deleteCard } from "../../firebase/firestoreProductionFunctions"
import { authContext }  from "../../contexts/authContext";

export default function ConfirmDelete() {
  // ConfirmDelete is a slightly different case cause it does not live within the drawer. it itself is a modal. 
  let { closeForm , formProps } = useContext(formsContext);
  let { uid : userUid } = useContext(authContext);
  let cardUid = formProps.cardUid;
  console.log(`inside confirmDelete component. userUid is ${userUid} and cardUid is ${cardUid}`);

  const [open, setOpen] = React.useState(true); // internal state 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false); // only closes the drawer. it does not unmount the ConfirmDelete component. ( Super important subtlety -- )
    // resetFormProps(); // this line will change the state ( defined in Author ) in such a way that it will prevent ConfirmDelete from being rendered ( falsy conditional rendering ) (ie. the ConfirmDelete will unmount)
    closeForm();
  };

// useEffect( ()=>{
//   return( setOpen(true))
// })

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
                Are you sure
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button       
            onClick={ () => { handleClose() }} >
              Disagree
          </Button>
          <Button
          onClick= { () => {
            ( async() => {
              await deleteCard(userUid  , cardUid )   // deletes card in Firebase
              handleClose()
            })()
          }}
          autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
