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
import Container from "@mui/material/Container"
import CssBaseline from "@mui/material/CssBaseline"
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import IconButton from '@mui/material/IconButton';
import Button from "@mui/material/Button";
import { createTheme } from "@mui/material/styles"
import ButtonBase from "@mui/material/ButtonBase"
import GenericCard from "../components/main/GenericCard";
import Navbar from "../components/Navbar"



const Queue = (props) => {

    let styles = {
        
    }

    return (
        <>
        <Navbar/>
        <CssBaseline/>
        <Box sx={{    background: "#e96443" , 
                        background: "-webkit-linear-gradient(to bottom, #904e95, #e96443)",
                        background: "linear-gradient(to bottom, #904e95, #e96443)",
                        pt : "2em",      }}>
            <Container maxWidth="lg"> 
            <Paper variant="outlined" sx={{ boxShadow : 1 , height : "100%" , width : "100%", p:2 }} >                      
                <Stack direction="row" spacing={1} sx={{p : 1.5 , direction:"row" , spacing:1 }}>
                    <Typography fontSize=" 1.05rem">
                        Posts ( 1220)
                    </Typography> 
                </Stack>
        
                <Box > 

                < GenericCard variant="outlined" sx={{ width: "100%", height :"150px" } } /> 
                <Card variant="outlined" sx={{ width: "100%", height :"150px" } }>      </Card> 
                <Card variant="outlined" sx={{ width: "100%", height :"150px" } }>      </Card>
                <Card variant="outlined" sx={{ width: "100%", height :"150px" } }>      </Card>
                <Card variant="outlined" sx={{ width: "100%", height :"150px" } }>      </Card>
        
                </Box>
            </Paper>

            </Container>
        </Box>
        </> 

      );
}
 
export default Queue;

