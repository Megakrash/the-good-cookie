import { AppBar, Box, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { VariablesColors } from "@/styles/Variables.colors";
import CookieIcon from "@mui/icons-material/Cookie";
import { useMutation } from "@apollo/client";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { mutationSignOut } from "@/graphql/Users";
import { useUserContext } from "@/context/UserContext";

const colors = new VariablesColors();
const { colorOrange, colorLightGrey } = colors;

const BackOfficeAppBar = (): React.ReactNode => {
  const router = useRouter();
  // User connected ?
  const { user, refetchUserContext } = useUserContext();
  // Signout
  const [doSignout] = useMutation(mutationSignOut, {
    onCompleted: () => {
      refetchUserContext();
      router.replace(`/tgc-backoffice`);
    },
  });
  const handleSignOut = () => {
    doSignout();
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: 75,
        backgroundColor: colorLightGrey,
      }}
    >
      <Box
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "auto",
        }}
      >
        <Tooltip title="Revenir sur le dashboard">
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/tgc-backoffice`);
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
        {user && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Box>
                <Typography>Admin : {user.nickName}</Typography>
              </Box>
              <Box
                onClick={handleSignOut}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <ExitToAppIcon
                  sx={{ width: "35px", height: "auto", color: colorOrange }}
                />
                <Typography sx={{ marginLeft: "10px" }}>
                  Se déconnecter
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </AppBar>
  );
};

export default BackOfficeAppBar;
