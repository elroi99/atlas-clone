import { Typography } from "@mui/material";
import Card from "@mui/material/Card"
import Stack from "@mui/material/Stack"
import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Icon from '@mui/material/Icon';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper"
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Button from "@mui/material/Button"
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import GenericCard from "./GenericCard"
 
const Right = (props) => {

    return ( 
    <>
    <Paper variant="outlined" sx={{ boxShadow : 1 , height : "100%" , width : "100%", p : 1 }} >                      
        <Stack direction="row" spacing={1} sx={{pb : 1.5 }}>
            <Typography >
                Posts ( 1220)
            </Typography> 
        </Stack>

        <Box > 

        <GenericCard variant="outlined" sx={{ width: "100%", height :"150px" }} cardType="details" />



        </Box>
    </Paper>
    </> 
    );
}
 
export default Right;
