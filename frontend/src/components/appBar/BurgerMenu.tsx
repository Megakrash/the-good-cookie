import React from "react";
import { useRouter } from "next/router";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const BurgerMenu = () => {
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        sx={{
          color: "#e89116",
        }}
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
        <MenuItem
          onClick={() => {
            handleCloseNavMenu();
            router.replace(`/annonces/new`);
          }}
        >
          <Typography textAlign="center"> Déposer une annonce</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseNavMenu();
            router.replace(`/recherche`);
          }}
        >
          <Typography textAlign="center"> Recherche</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseNavMenu();
            router.replace(`/compte`);
          }}
        >
          <Typography textAlign="center"> Compte</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseNavMenu();
            router.replace(`/contact`);
          }}
        >
          <Typography textAlign="center"> Contact</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BurgerMenu;
