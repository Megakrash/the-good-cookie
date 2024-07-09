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
import MessageIcon from "@mui/icons-material/Message";
import { VariablesColors } from "@/styles/Variables.colors";
import { useUserContext } from "@/context/UserContext";
import UserSignInAndOut from "@/components/users/components/UserSignInAndOut";

const colors = new VariablesColors();
const { colorOrange } = colors;

const UserMenu = () => {
  const router = useRouter();
  // Get user from context
  const { user } = useUserContext();

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
              user && user.picture
                ? `${process.env.NEXT_PUBLIC_PATH_IMAGE}${user.picture}`
                : "/images/default/avatar.webp"
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
        {user && (
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
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                router.push(`/messages`);
              }}
            >
              <MessageIcon
                sx={{ width: "35px", height: "auto", color: colorOrange }}
              />
              <Typography sx={{ marginLeft: "10px" }}>Messages</Typography>
            </MenuItem>
            <Divider />
          </Box>
        )}
        <UserSignInAndOut handleClose={handleCloseUserMenu} />
      </Menu>
    </Box>
  );
};

export default UserMenu;
