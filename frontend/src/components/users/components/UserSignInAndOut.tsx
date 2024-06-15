import React from "react";
import { useRouter } from "next/router";
import LoginIcon from "@mui/icons-material/Login";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useUserContext } from "@/context/UserContext";
import { VariablesColors } from "@/styles/Variables.colors";
import { MenuItem, Typography } from "@mui/material";
import { useMutation } from "@apollo/client";
import { mutationSignOut } from "@/graphql/auth/mutationSignOut";

const colors = new VariablesColors();
const { colorOrange } = colors;

type UserSignInAndOutProps = {
  handleClose?: () => void;
};

const UserSignInAndOut = (props: UserSignInAndOutProps): React.ReactNode => {
  const router = useRouter();
  // Get user from context
  const { user, refetchUserContext } = useUserContext();

  // Signout
  const [doSignout] = useMutation(mutationSignOut, {
    onCompleted: () => {
      refetchUserContext();
      props.handleClose();
    },
  });
  const logout = () => {
    doSignout();
  };
  return (
    <>
      {user ? (
        <MenuItem onClick={logout}>
          <ExitToAppIcon
            sx={{ width: "30px", height: "auto", color: colorOrange }}
          />
          <Typography sx={{ marginLeft: "10px" }}>Se déconnecter</Typography>
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => {
            props.handleClose();
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
    </>
  );
};

export default UserSignInAndOut;
