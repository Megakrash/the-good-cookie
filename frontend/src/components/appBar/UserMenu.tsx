import React from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import { PATH_IMAGE } from "@/api/configApi";
import { useMutation } from "@apollo/client";
import { mutationSignOut } from "../../graphql/Users";
import { VariablesColors } from "@/styles/Variables.colors";
import { useUserContext } from "@/context/UserContext";

const colors = new VariablesColors();
const { colorOrange } = colors;

const UserMenu = () => {
  const router = useRouter();
  // Get user from context
  const { user, refetchUserContext } = useUserContext();

  // Signout
  const [doSignout] = useMutation(mutationSignOut, {
    onCompleted: () => {
      refetchUserContext();
      setAnchorElUser(null);
      router.push(`/signin`);
    },
  });
  const logout = () => {
    doSignout();
  };

  // User menu open/close
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box>
      <Tooltip title="Ouvrir le menu du profil">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            alt="User avatar"
            src={
              user && user.picture.filename
                ? `${PATH_IMAGE}/pictures/${user.picture.filename}`
                : `${PATH_IMAGE}/default/avatar.webp`
            }
          />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: "50px" }}
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
        onClick={handleCloseUserMenu}
        onClose={handleCloseUserMenu}
      >
        {user ? (
          <Box sx={{ width: "210px" }}>
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                router.push(`/account`);
              }}
            >
              <AccountCircleIcon
                sx={{ width: "35px", height: "auto", color: colorOrange }}
              />
              <Typography sx={{ marginLeft: "10px" }}>Mon compte</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout}>
              <ExitToAppIcon
                sx={{ width: "30px", height: "auto", color: colorOrange }}
              />
              <Typography sx={{ marginLeft: "10px" }}>
                Se déconnecter
              </Typography>
            </MenuItem>
          </Box>
        ) : (
          <MenuItem
            onClick={() => {
              handleCloseUserMenu();
              router.push(`/signin`);
            }}
          >
            <LoginIcon
              sx={{
                width: "30px",
                marginRight: "8px",
                height: "auto",
                color: colorOrange,
              }}
            />
            <Typography textAlign="center">Se connecter</Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default UserMenu;
