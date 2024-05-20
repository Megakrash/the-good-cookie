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
import { mutationUserLogin } from "@/graphql/Users";
import { useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
import router from "next/router";
import UserPassword from "../components/UserPassword";
import UserEmail from "../components/UserEmail";
import { VariablesColors } from "@/styles/Variables.colors";
import { GreyBtnOrangeHover } from "@/styles/MuiButtons";
import {
  isValidEmailRegex,
  isValidPasswordRegex,
} from "../components/UserRegex";
import { useUserContext } from "@/context/UserContext";

const colors = new VariablesColors();
const { colorWhite, successColor, errorColor } = colors;

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
        toast(`Connexion réussie, bienvenue ${data.item.firstName}`, {
          style: { background: successColor, color: colorWhite },
        });
        refetchUserContext();
        setTimeout(() => {
          router.push(`/account`);
        }, 1500);
      }
    } catch (error) {
      if (error.message === "Failed to fetch") {
        toast("Erreur de connexion, veuillez réessayer", {
          style: { background: errorColor, color: colorWhite },
        });
      } else {
        toast(error.message, {
          style: { background: errorColor, color: colorWhite },
        });
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
        autoComplete="off"
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
