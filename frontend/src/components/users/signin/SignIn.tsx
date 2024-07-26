import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  FormControl,
  Grid,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import { mutationUserLogin } from "@/graphql/auth/mutationUserLogin";
import { useMutation } from "@apollo/client";
import { Toaster } from "react-hot-toast";
import UserPassword from "../components/UserPassword";
import UserEmail from "../components/UserEmail";
import { GreyBtnOrangeHover } from "@/styles/MuiButtons";
import {
  isValidEmailRegex,
  isValidPasswordRegex,
} from "../components/UserRegex";
import { useUserContext } from "@/context/UserContext";
import { showToast } from "@/components/utils/toastHelper";
import router from "next/router";

const SignIn = (): React.ReactElement => {
  const theme = useTheme();
  const { refetchUserContext } = useUserContext();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    const isEmailValid = isValidEmailRegex(email);
    const isPasswordValid = isValidPasswordRegex(password);
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  const [doLogin] = useMutation(mutationUserLogin);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await doLogin({
        variables: { data: { email, password } },
      });
      if ("id" in data.item) {
        showToast(
          "success",
          `Connexion réussie, bienvenue ${data.item.firstName}`,
        );
        refetchUserContext();
        const previousUrl = localStorage.getItem("previousUrl") || "/";
        localStorage.removeItem("previousUrl");
        router.replace(previousUrl);
      }
    } catch (error) {
      if (error.message === "Failed to fetch") {
        showToast("error", "Erreur de connexion, veuillez réessayer");
      } else {
        showToast("error", error.message);
      }
      setEmail("");
      setPassword("");
    }
  };

  return (
    <Grid
      container
      item
      xs={12}
      sx={{
        marginTop: "1%",
        marginRight: "auto",
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Se connecter
      </Typography>
      <Toaster />
      <FormControl
        component="form"
        autoComplete="on"
        onSubmit={onSubmit}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid item container xs={11} sm={7} md={6} lg={5} xl={4}>
          <Card
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              padding: 5,
              [theme.breakpoints.down("sm")]: {
                padding: 3,
              },
            }}
          >
            <Grid
              container
              item
              xs={12}
              sm={11}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <UserEmail email={email} setEmail={setEmail} />
              <UserPassword password={password} setPassword={setPassword} />
            </Grid>
            <Grid item xs={12}>
              <Link variant="body2" href="/forgot-password">
                {"Mot de passe oublié ?"}
              </Link>
            </Grid>
            <Grid item xs={12} marginTop={3}>
              <GreyBtnOrangeHover type="submit" disabled={!isFormValid}>
                Se connecter
              </GreyBtnOrangeHover>
            </Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                [theme.breakpoints.down("sm")]: {
                  flexDirection: "column",
                },
                gap: "5px",
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Première connexion ?
              </Typography>
              <Link variant="body2" href="/signup">
                {"Créez votre compte"}
              </Link>
            </Box>
          </Card>
        </Grid>
      </FormControl>
    </Grid>
  );
};

export default SignIn;
