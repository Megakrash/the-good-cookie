import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
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
import { useMutation, useQuery } from "@apollo/client";
import { mutationSignOut, queryMeContext } from "../graphql/Users";
import { UserContextTypes } from "@/types/UserTypes";

const UserMenu = () => {
  const router = useRouter();
  // User connected ?
  const { data, error } = useQuery<{ item: UserContextTypes }>(queryMeContext);
  const [userContext, setUserContext] = useState<UserContextTypes>(null);
  const [userConnected, setUserConnected] = useState<Boolean>(false);

  useEffect(() => {
    if (error) {
      setUserContext(null);
      setUserConnected(false);
    }
    if (data?.item) {
      setUserContext(data.item);
      setUserConnected(true);
    }
  }, [data, error]);

  // Signout
  const [doSignout] = useMutation(mutationSignOut, {
    onCompleted: () => {
      setUserContext(null);
      setAnchorElUser(null);
      setUserConnected(false);
      router.replace(`/signin`);
    },
    refetchQueries: [{ query: queryMeContext }],
  });
  async function logout() {
    doSignout();
  }
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
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Ouvrir le menu du profil">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            alt="User avatar"
            src={
              userConnected && userContext.picture.path
                ? `${userContext.picture.path}`
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
              router.replace(`/signin`);
            }}
          >
            <LoginIcon />
            <Typography textAlign="center">Connexion</Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default UserMenu;
