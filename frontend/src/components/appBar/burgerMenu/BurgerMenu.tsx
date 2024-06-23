import React from "react";
import { Box, Divider, IconButton, Menu, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { VariablesColors } from "@/styles/Variables.colors";
import BurgerItems from "./components/BurgerItems";
import BurgerCategories from "./components/BurgerCategories";
import BurgerHeader from "./components/BurgerHeader";
import UserSignInAndOut from "@/components/users/components/UserSignInAndOut";

const colors = new VariablesColors();
const { colorDarkOrange } = colors;

const BurgerMenu = () => {
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
      <Tooltip title="Ouvrir le menu principal">
        <IconButton
          size="large"
          aria-label="Burger menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          sx={{
            color: colorDarkOrange,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiPaper-root": {
            width: 340,
          },
        }}
      >
        <BurgerHeader handleCloseNavMenu={handleCloseNavMenu} />
        <Divider />
        <BurgerItems handleCloseNavMenu={handleCloseNavMenu} />
        <Divider />
        <BurgerCategories handleCloseNavMenu={handleCloseNavMenu} />
        <UserSignInAndOut handleClose={handleCloseNavMenu} />
      </Menu>
    </Box>
  );
};

export default BurgerMenu;
