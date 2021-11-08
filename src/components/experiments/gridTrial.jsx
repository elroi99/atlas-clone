import Grid from "@mui/material/Grid"
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const GridTrial = () => {

    
    return ( 
    <> 
        
            <Grid container md={12} spacing={10} >
                <Grid item xs={5}>
                    <Paper> 
                        <Typography  height="200px" backgroundColor="blue">
                            Firstaaaaaaaaaaaaa
                        </Typography>
                    </Paper>
                </Grid> 
                <Grid item xs>
                    <Paper> 
                        <Typography  height="200px">
                            Secondddddddddd 
                        </Typography>
                    </Paper>
                </Grid> 
                <Grid item xs="auto" >
                    <Paper> 
                        <Typography  height="200px" >
                            Thirdddddddddddddd
                        </Typography>
                    </Paper>
                </Grid> 
                <Grid item xs >
                    <Paper> 
                        <Typography  height="200px">
                            Thirdddddddddddddd
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs >
                    <Paper> 
                        <Typography  height="200px">
                            Thirdddddddddddddd
                        </Typography>
                    </Paper>
                </Grid>
                
            </Grid>
    </>  
    );
}
 
export default GridTrial;