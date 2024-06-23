import React from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CookieIcon from "@mui/icons-material/Cookie";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import MessageIcon from "@mui/icons-material/Message";
import BurgerMenu from "./burgerMenu/BurgerMenu";
import UserMenu from "./userMenu/UserMenu";
import { VariablesColors } from "@/styles/Variables.colors";
import Navbar from "./navbar/Navbar";

const colors = new VariablesColors();
const { colorDarkGrey, colorOrange, colorLightOrange } = colors;

const buttonStyles = {
  color: "white",
  "& .MuiButton-startIcon": {
    marginRight: "-4px",
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const Header = (): React.ReactNode => {
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <AppBar position="sticky" sx={{ backgroundColor: colorDarkGrey }}>
      <Toolbar
        sx={{
          width: "100%",
          height: "70px",
          margin: "auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Mobile Menu */}
        <BurgerMenu />
        {/* Mobile Title */}
        <Tooltip title="Revenir sur la page d'accueil">
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/`);
            }}
          >
            <CookieIcon sx={{ color: colorOrange }} />

            <Typography
              component="div"
              sx={{
                color: colorOrange,
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: ".2rem",
              }}
            >
              TGC
            </Typography>
          </Box>
        </Tooltip>
        {/* Desktop Title */}
        <Tooltip title="Revenir sur la page d'accueil">
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/`);
            }}
          >
            <CookieIcon sx={{ color: colorOrange }} />

            <Typography
              sx={{
                color: colorOrange,
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              THE GOOD COOKIE
            </Typography>
          </Box>
        </Tooltip>
        {/* Big Buttons */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "row",
            gap: "15px",
          }}
        >
          {/* Post Add Button */}
          <Button
            variant="contained"
            size="large"
            type="button"
            sx={{
              backgroundColor: colorLightOrange,
              fontWeight: 550,
            }}
            startIcon={isSmallScreen ? null : <EditNoteIcon />}
            onClick={() => {
              router.push(`/ads/new`);
            }}
          >
            Déposer une annonce
          </Button>
          {/* Search Button */}
          <Button
            variant="contained"
            size="large"
            type="button"
            sx={{
              backgroundColor: colorLightOrange,
              fontWeight: 550,
            }}
            startIcon={isSmallScreen ? null : <SearchIcon />}
            onClick={() => {
              router.push(`/search`);
            }}
          >
            {isSmallScreen ? "Rechercher" : "Rechercher une annonce"}
          </Button>
        </Box>
        {/* Menu */}
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Button
            startIcon={<MessageIcon />}
            onClick={() => {
              router.push(`/messages`);
            }}
            sx={buttonStyles}
          >
            Messages
          </Button>
          <Button
            startIcon={<ContactSupportIcon />}
            onClick={() => {
              router.push(`/contact`);
            }}
            sx={buttonStyles}
          >
            contact
          </Button>
        </Box>
        {/* User menu */}
        <UserMenu />
      </Toolbar>
      <Navbar />
    </AppBar>
  );
};
export default Header;
