import { signInWithFirebase , signout , auth } from "../firebase/firebase";
import { getAuth, onAuthStateChanged , signOut }  from "firebase/auth";
import { authContext} from "../contexts/authContext";
import { useContext , useEffect } from "react";
import { useHistory } from "react-router-dom"
import { Typography , Button , Box , Link ,  } from '@mui/material';
import { db } from "../firebase/firebase";
import SvgIcon from '@mui/material/SvgIcon';
import linkedinLogo from "../assets/linkedinLogo.png";
import twitterLogo from "../assets/twitterLogo.png";
import githubLogo from "../assets/githubLogo.png"
import Container from '@mui/material/Container';


// you only see landing page when you are logged out. ie. you can only Log In from Landing
// conversely, you only see the other pages when you are logged in.
// you can only log in from the Navbar. 

const Landing = () => {

  let data = useContext(authContext); 
  
    const history = useHistory();
    function routeChange(){
        history.push("/author");
      }

  let devStyle = { 
    border : "2px solid black",
  }

  let topBannerStyle = {
      fontSize : "2.5rem",
      textAlign : "center"
  }

  let bsslt = { 
    fontSize : "2em" , 
    color : "#d6d0d0" 
  }


  // black section subsection small text
  let bssst = { 
    color : "#d6d0d0"
  }

  // black section subsection image container
  let bssic = { 
    display : "Flex" , 
    justifyContent : "center"
  }
  

    return (
      <>
      <Box sx={{  backgroundColor : "#F0F3F9" }}>
      <Container maxWidth="lg" > 

          {/* navbar */}
          <Box sx={{ display : "flex" , flexDirection : "row" , alignItems : "center" }}>
              
              <SvgIcon sx={{ display : "span" }}> 
                <svg width="90" height="24" viewBox="0 0 90 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.638885 11.4586C0.876443 10.5935 1.04667 9.70312 1.36301 8.86754C3.07798 4.3388 7.9796 2.14229 12.503 3.84576C12.7256 3.92949 12.9382 4.03942 13.1437 4.1883C11.2385 4.04811 9.47922 4.41535 7.87261 5.44025C4.83397 7.3785 3.48508 11.1945 4.64466 14.5878C5.78379 17.9213 9.12868 20.2192 12.4834 19.9728C16.3459 19.689 19.3674 17.0603 19.9822 13.4484C20.8115 8.57576 17.2611 3.36751 12.3292 2.22426C9.94357 1.67137 7.64609 1.88552 5.45396 3.01262C5.35569 3.06324 5.2483 3.0969 5.14335 3.13327C5.12959 3.13802 5.10519 3.11237 5.04563 3.07708C6.55957 1.871 8.26418 1.14847 10.1453 0.805249C17.216 -0.484837 23.8701 5.33073 23.494 12.4751C23.1833 18.3794 18.6445 22.9636 12.7254 23.3511C7.04109 23.7233 1.94688 19.7118 0.856953 14.0066C0.789489 13.6539 0.711802 13.303 0.638885 12.9514C0.638885 12.4538 0.638885 11.9562 0.638885 11.4586Z" fill="#1D1D1F"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M60.1587 4.33376C60.1606 3.38917 60.1625 2.44459 60.1641 1.5H57.2442C57.2364 1.56384 57.2265 1.62766 57.2167 1.69149C57.1955 1.82859 57.1743 1.96568 57.1742 2.10282C57.1709 7.4752 57.1709 12.8476 57.171 18.22C57.171 19.0252 57.171 19.8305 57.171 20.6358V21.223H60.148V20.5891C60.148 19.58 60.1478 18.5709 60.1476 17.5618C60.1471 15.2773 60.1467 12.9929 60.1485 10.7085C60.1503 8.5836 60.1545 6.45868 60.1587 4.33376ZM51.0673 21.4971C50.859 21.4183 50.6432 21.3505 50.4274 21.2826C49.9479 21.1319 49.4685 20.9812 49.0722 20.7101C48.0571 20.0152 47.7553 18.8773 47.7283 17.7146C47.6941 16.2434 47.6965 14.7714 47.699 13.2994C47.7 12.6872 47.701 12.075 47.6994 11.4628C47.699 11.3152 47.6991 11.1676 47.6992 11.0013L47.6993 10.7484H46.1449V8.23368H47.6738V3.8791L50.6392 3.55613V8.20474H54.4902V10.7277H50.6767C50.6719 10.8062 50.6665 10.8786 50.6613 10.947C50.6512 11.0821 50.6422 11.2013 50.6421 11.3206C50.6398 13.0883 50.6405 14.8561 50.6414 16.6238C50.6415 16.7539 50.6442 16.8844 50.6535 17.0142C50.7643 18.5609 51.4197 19.005 52.9206 18.5409C53.1239 18.478 53.3225 18.3994 53.5393 18.3136L53.5395 18.3135C53.6449 18.2718 53.7548 18.2283 53.8716 18.1841L54.635 20.6435C54.0485 21.0805 53.3657 21.222 52.6843 21.3632C52.4812 21.4052 52.2783 21.4473 52.078 21.4971H51.0673ZM66.2135 14.1574C66.3568 12.1314 68.1521 10.5695 70.1619 10.7223C72.2207 10.7633 73.8074 12.6438 73.7139 14.9911C73.6173 17.4198 71.7564 18.8908 69.7965 18.7625C67.3166 18.6003 66.0189 16.908 66.2135 14.1574ZM68.5285 21.414C68.6605 21.441 68.7926 21.468 68.924 21.4971H70.0471C70.0742 21.4862 70.101 21.4732 70.1278 21.4602L70.1279 21.4601L70.1279 21.4601L70.128 21.4601L70.1281 21.4601C70.1858 21.432 70.2435 21.404 70.3036 21.3972C71.5908 21.2524 72.6491 20.6872 73.488 19.7065C73.5182 19.6712 73.5656 19.6504 73.6351 19.62C73.6755 19.6023 73.7234 19.5813 73.7797 19.5524V21.2208H76.5207V8.26402H73.5797V9.76313C73.5299 9.73025 73.491 9.70678 73.4602 9.68812C73.4104 9.65803 73.3813 9.64046 73.36 9.61612C71.2565 7.21813 66.5769 7.49653 64.4735 10.5351C62.8602 12.8657 62.7328 15.396 63.8334 17.9696C64.5588 19.6659 65.9045 20.7121 67.6753 21.217C67.9556 21.2969 68.2419 21.3555 68.5283 21.414L68.5283 21.414L68.5284 21.414L68.5284 21.414L68.5285 21.414ZM35.451 18.2682C34.1229 17.5167 33.6179 16.2763 33.6067 14.4863C33.6065 12.846 34.6241 11.3534 36.289 10.8689C38.539 10.2143 40.7957 11.6921 41.086 14.0141C41.3025 15.7461 40.9022 17.257 39.3356 18.2261C38.08 19.0029 36.73 18.9919 35.451 18.2682ZM35.9601 21.4142L35.9602 21.4142C36.092 21.4412 36.2239 21.4681 36.3551 21.4971H37.4781C37.5052 21.4862 37.5319 21.4732 37.5587 21.4602C37.6165 21.4321 37.6743 21.404 37.7345 21.3973C39.0218 21.2525 40.08 20.6872 40.9189 19.7066C40.9492 19.6712 40.9967 19.6504 41.0664 19.6199C41.1068 19.6022 41.1546 19.5813 41.2108 19.5524V21.2208H43.9517V8.26405H41.0107V9.76306C40.9606 9.73002 40.9217 9.70649 40.8907 9.68781L40.8907 9.68779C40.8411 9.65785 40.8122 9.64037 40.791 9.61615C38.6874 7.21806 34.0078 7.49668 31.9045 10.5351C30.2913 12.8657 30.1638 15.396 31.2643 17.9696C31.9897 19.6659 33.3355 20.712 35.1063 21.217C35.3868 21.297 35.6734 21.3556 35.9601 21.4142ZM83.0126 21.3631L83.0128 21.3631C83.2209 21.4067 83.4291 21.4503 83.6363 21.4971H84.6471C84.7155 21.4851 84.7839 21.4722 84.8522 21.4593L84.8524 21.4592L84.8525 21.4592C85.0023 21.4309 85.152 21.4026 85.3029 21.3835C86.2054 21.2692 87.039 20.9974 87.7924 20.4623C89.4628 19.2758 89.9716 15.7424 87.39 14.5013C87.0208 14.3238 86.6435 14.1629 86.2662 14.002L86.2661 14.0019C86.0256 13.8994 85.785 13.7968 85.5465 13.6899C85.3699 13.6107 85.1929 13.5321 85.0159 13.4536L85.0155 13.4534L85.0151 13.4532C84.3917 13.1766 83.7682 12.8999 83.1597 12.5938C82.7594 12.3925 82.4971 12.051 82.5681 11.55C82.6426 11.0249 83.0257 10.7953 83.4694 10.668C83.7301 10.5931 84.0222 10.5878 84.2967 10.6054C85.4389 10.6792 86.4102 11.1662 87.3036 11.9506L88.7586 9.68096C86.9947 8.03382 83.727 7.54271 81.6284 8.57776C79.1077 9.82094 78.813 13.1409 81.1105 14.7712C81.6448 15.1503 82.2632 15.4209 82.8726 15.6875C82.947 15.7201 83.0212 15.7525 83.0951 15.7851C83.455 15.9439 83.8238 16.0833 84.1925 16.2227L84.1927 16.2228L84.1927 16.2228C84.6621 16.4002 85.1313 16.5776 85.5815 16.7947C86.3323 17.1568 86.3641 18.0298 85.6717 18.5034C85.4209 18.6749 85.0989 18.7956 84.7964 18.8318C83.1594 19.0278 81.7357 18.547 80.5205 17.3591L79.0322 19.5535C79.8167 20.2582 80.667 20.7546 81.628 21.0353C82.0826 21.1681 82.5476 21.2656 83.0126 21.363L83.0126 21.3631Z" fill="#1D1D1F"/>
                </svg>
              </SvgIcon>

              <Typography sx={{ pl : 0.5 , fontSize : "1.5rem" }}> atlas </Typography>

              <Button 
              className="landingPageNavBtn" 
              onClick = { () => { signInWithFirebase() } }
              sx={{ ml : "auto" ,
                    color : "black" ,
                    ":hover" : {
                      backgroundColor : "white"
                    }
                    }}> 
              Get Started  
              </Button> 

          </Box>  

          {/* header message -- white section */}
          <Box sx={{ mt : 15 }}> 
            <Typography sx={{ fontSize : "2.7rem" , textAlign : "center" , color : "#333333" , fontWeight : "500" , py : 0}}> The internet is full of knowlege  </Typography> 
            <Typography sx={{ fontSize : "2.7rem" , textAlign : "center" , color : "#474EEF" , pt : "0" }}> Stop wasting it </Typography> 
            <Typography sx={{ fontSize : "1.2rem" , textAlign : "center" , color : "#8C8D93"}}> Atlas helps you collect, organize and summarize <br/> knowledge rich content from around the web </Typography>
            
            <Box sx={{ display: "flex" , justifyContent : "center" }}>
              <Button 
              variant = "contained"
              onClick = { () => { signInWithFirebase() } }
              sx={{ 
                  mt : "1rem" ,  
                  height : "3rem" , 
                  width : "20rem" , 
                  fontSize : "2rem",
                  backgroundColor : "black" ,
                  ":hover" : {
                    backgroundColor : "#4F56EF"
                  }
              }}>
                Get Started
              </Button> 
            </Box>

          </Box> 
        
        {/* black section */}
         <Box sx={{ display : "flex" , flexDirection : "column" ,  justifyContent : "center" , backgroundColor : "#1D1D1F" , mt : 10 , pb : 10  }}>
          
          {/* black section header ("How it works") */}
          <Typography sx={{ textAlign : "center" , fontSize : "1.7rem" , color : "#d6d0d0" , mt : "1.5rem" , pb : "0.5rem" }}> Atlas Video Demo  </Typography>

          {/* video section */}
          <iframe height="560px" width="auto" src="https://www.youtube.com/embed/HTycd5yz__o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/HTycd5yz__o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>     */}
        </Box> 
  
         {/* black section end */}


        {/* video section */}
        


    
          {/* <Box sx={ { }}> 
            <Box>
              <Typography> Build your digital library, effortlessly  </Typography> 
              <Typography> Atlas creates a link for every topic you create, capturing the compounding value of knowledge over time. </Typography> 
            </Box> 

            <Box>
              <img src="" />
            </Box> 
          </Box> */}

            {/* bottom call to action */}
            <Box sx={{ mt : 10 }}>
              <Typography sx={{ textAlign : "center" , fontSize : "2.7rem" , color : "#333333" , fontWeight : "500"}}>
                 This app was cloned from <Link href="https://atlas.fm/tony/" sx={{ fontStyle : "italic"  }}> Atlas.fm </Link>   
              </Typography>
            <Box sx={{ display : "flex" , justifyContent : "center" , mt : 3}}> 



            </Box>
          </Box> 
          

          {/* Footer */}
          <Box sx={{ display : "flex" , alignItems : "center" , height : "75px" , mt : "5rem" , borderTop : "4px solid #1D1D1F" }}>
            <Typography variant="h5" sx={{ ml : "auto" , mr : "2rem"}}> Made with <span> ❤️ </span> by Elroi Noronha</Typography> 
            <Box>
                <Link href="https://github.com/elroi99"> 
                    <img style={{ width : "35px" , height : "auto" , marginLeft : "1rem" }} alt="github logo" src={ githubLogo } />  
                </Link>
            </Box>
            <Box>
                <Link href="https://www.linkedin.com/in/elroinoronha/"> 
                    <img style={{ width : "35px" , height : "auto" , marginLeft : "1rem" }} alt="linkedin logo" src={ linkedinLogo } />  
                </Link>
            </Box>
            <Box> 
              <Link href="https://twitter.com/ElroiNoronha"> 
                      <img style={{ width : "35px" , height : "auto" , marginLeft : "1rem" }} alt="twitter logo" src={ twitterLogo } />  
              </Link>
            </Box>
        </Box>
        
          </Container>
          </Box> 
        </>   
        
        );

}
 
export default Landing;
