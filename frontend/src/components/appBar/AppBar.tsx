import React from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "@mui/material/Link";
import CookieIcon from "@mui/icons-material/Cookie";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import MessageIcon from "@mui/icons-material/Message";
import BurgerMenu from "./BurgerMenu";
import UserMenu from "./UserMenu";
import { VariablesColors } from "@/styles/Variables.colors";

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

export default function Header(): React.ReactNode {
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <AppBar position="static" sx={{ backgroundColor: colorDarkGrey }}>
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
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Link href="/">
            <CookieIcon sx={{ color: colorOrange }} />
          </Link>
          <Link href="/" underline="none">
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
          </Link>
        </Box>
        {/* Desktop Title */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Link href="/">
            <CookieIcon sx={{ color: colorOrange }} />
          </Link>
          <Link href="/" underline="none">
            <Typography
              sx={{
                color: colorOrange,
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              THE GOOD COOKIE
            </Typography>
          </Link>
        </Box>
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
              router.replace(`/annonces/new`);
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
              router.replace(`/search`);
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
              router.replace(`/messages`);
            }}
            sx={buttonStyles}
          >
            Messagerie
          </Button>
          <Button
            startIcon={<ContactSupportIcon />}
            onClick={() => {
              router.replace(`/contact`);
            }}
            sx={buttonStyles}
          >
            contact
          </Button>
        </Box>
        {/* User menu */}
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}
