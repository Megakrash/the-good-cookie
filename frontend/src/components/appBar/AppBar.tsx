import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import CookieIcon from "@mui/icons-material/Cookie";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BurgerMenu from "./BurgerMenu";
import UserMenu from "./UserMenu";

const buttonStyles = {
  color: "white",
  "& .MuiButton-startIcon": {
    marginRight: "-4px",
  },
};

export default function Header(): React.ReactNode {
  const router = useRouter();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#343a40" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters className="header">
          {/* Desktop Title */}
          <Box
            className="header_title"
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            <Link href="/">
              <CookieIcon className="header_title_logo" />
            </Link>
            <Link href="/" className="header_title_name">
              THE GOOD COOKIE
            </Link>
          </Box>
          {/* Mobile Menu */}
          <BurgerMenu />
          {/* Mobile Title */}
          <CookieIcon
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              color: "#e89116",
            }}
          />
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "#e89116",
              textDecoration: "none",
            }}
          >
            <Link href="/" passHref className="header_title_name">
              TGC
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              className="header_link_button"
              startIcon={<EditNoteIcon fontSize="large" />}
              onClick={() => {
                router.replace(`/annonces/new`);
              }}
              sx={buttonStyles}
            >
              Déposer une annonce
            </Button>
            <Button
              className="header_link_button"
              startIcon={<SearchIcon />}
              onClick={() => {
                router.replace(`/recherche`);
              }}
              sx={buttonStyles}
            >
              Recherche
            </Button>
            <Button
              className="header_link_button"
              startIcon={<AccountCircleIcon />}
              onClick={() => {
                router.replace(`/compte`);
              }}
              sx={buttonStyles}
            >
              Compte
            </Button>
            <Button
              className="header_link_button"
              startIcon={<ContactSupportIcon />}
              onClick={() => {
                router.replace(`/contact`);
              }}
              sx={buttonStyles}
            >
              contact
            </Button>
          </Box>
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
