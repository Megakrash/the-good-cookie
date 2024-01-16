import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useMutation, useQuery } from "@apollo/client";
import { mutationSignOut, queryMeContext } from "../graphql/Users";
import { UserContextTypes } from "@/types/UserTypes";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useRouter } from "next/router";
import { PATH_IMAGE } from "@/api/configApi";

export default function Header(): React.ReactNode {
  const router = useRouter();
  // User connected ?
  const { data, error } = useQuery<{ item: UserContextTypes }>(queryMeContext);
  const userConnected = data ? data.item : null;
  console.log(data);
  // Logout
  const [doSignout] = useMutation(mutationSignOut, {
    refetchQueries: [queryMeContext],
  });
  async function logout() {
    doSignout();
  }
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "#343a40" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/">
            <AdbIcon
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 1,
                color: "#e89116",
              }}
            />
          </Link>
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              // fontFamily: "monospace",
              fontWeight: 700,
              // letterSpacing: ".3rem",
              color: "#e89116",
              textDecoration: "none",
            }}
          >
            THE GOOD CORNER
          </Typography>

          {/* <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TGC
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              startIcon={<EditNoteIcon fontSize="large" />}
              onClick={() => {
                handleCloseNavMenu();
                router.replace(`/annonces/new`);
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Déposer une annonce
            </Button>
            <Button
              startIcon={<SearchIcon />}
              onClick={() => {
                handleCloseNavMenu();
                router.replace(`/recherche`);
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Recherche
            </Button>
            <Button
              startIcon={<AccountCircleIcon />}
              onClick={() => {
                handleCloseNavMenu();
                router.replace(`/compte`);
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Compte
            </Button>
            <Button
              startIcon={<ContactSupportIcon />}
              onClick={() => {
                handleCloseNavMenu();
                router.replace(`/contact`);
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              contact
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Ouvrir le menu du profil">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="User avatar"
                  src={
                    userConnected
                      ? `${PATH_IMAGE}/pictures/${userConnected.picture}`
                      : `${PATH_IMAGE}/default/avatar.webp`
                  }
                />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userConnected ? (
                <Box>
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      router.replace(`/compte`);
                    }}
                  >
                    <AccountCircleIcon />
                    <Typography textAlign="center">Mon compte</Typography>
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    <ExitToAppIcon />
                    <Typography textAlign="center">Se déconnecter</Typography>
                  </MenuItem>
                </Box>
              ) : (
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    router.replace(`/connexion`);
                  }}
                >
                  <LoginIcon />
                  <Typography textAlign="center">Connexion</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
