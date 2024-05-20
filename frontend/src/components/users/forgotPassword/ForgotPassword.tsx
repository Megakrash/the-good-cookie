import React, { useEffect, useState } from "react";
import { Card, FormControl, Grid, Typography } from "@mui/material";
import { mutationForgotPassword } from "@/graphql/Users";
import { useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
import router from "next/router";
import UserEmail from "../components/UserEmail";
import LockIcon from "@mui/icons-material/Lock";
import { VariablesColors } from "@/styles/Variables.colors";
import { StepFormButton } from "@/styles/MuiButtons";
import { isValidEmailRegex } from "../components/UserRegex";

const colors = new VariablesColors();
const { colorWhite, successColor, errorColor, colorOrange } = colors;

const ForgotPassword = (): React.ReactElement => {
  // Set the email state
  const [email, setEmail] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    const isEmailValid = isValidEmailRegex(email);
    setIsFormValid(isEmailValid);
  }, [email]);

  const [doForgotPassword] = useMutation(mutationForgotPassword);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await doForgotPassword({
        variables: { email: email },
      });
      if (data.resetPassword) {
        toast(
          `Un email vous a été envoyé pour réinitialiser votre mot de passe`,
          {
            style: { background: successColor, color: colorWhite },
          },
        );
        setTimeout(() => {
          router.push(`/signin`);
        }, 2000);
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
    }
  };

  return (
    <Grid
      container
      item
      xs={12}
      sx={{
        marginTop: 2,
        marginRight: "auto",
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
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
        <Grid item container xs={11} sm={9} md={7} lg={5} xl={4}>
          <Card
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              padding: 3,
            }}
          >
            <LockIcon sx={{ fontSize: 50, color: colorOrange }} />
            <Typography
              variant="h5"
              fontWeight={700}
              marginTop={2}
              textAlign={"center"}
              gutterBottom
            >
              Mot de passe oublié ?
            </Typography>
            <Typography variant="subtitle2" textAlign={"center"} gutterBottom>
              Nous allons vous envoyer un lien par email sur votre adresse pour
              réinitialiser votre mot de passe.
            </Typography>
            <Grid
              container
              item
              xs={12}
              sm={11}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 3,
                gap: 3,
              }}
            >
              <UserEmail email={email} setEmail={setEmail} />
            </Grid>

            <Grid
              item
              xs={12}
              sm={11}
              marginTop={3}
              sx={{
                width: "100%",
              }}
            >
              <StepFormButton sx={{ width: "100%" }} disabled={!isFormValid}>
                Réinitialiser mon mot de passe
              </StepFormButton>
            </Grid>
          </Card>
        </Grid>
      </FormControl>
    </Grid>
  );
};

export default ForgotPassword;
