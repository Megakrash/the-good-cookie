import React from "react";
import UserEmail from "../components/UserEmail";
import UserName from "../components/UserName";
import UserPhone from "../components/UserPhone";
import UserPassword from "../components/UserPassword";
import UserProfil from "../components/UserProfil";
import UserGender from "../components/UserGender";
import PictureDownload from "../../utils/PictureDownload";
import { StepFormButton } from "@/styles/MuiButtons";
import { VariablesColors } from "@/styles/Variables.colors";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import {
  isValidEmailRegex,
  isValidNameRegex,
  isValidPhoneNumberRegex,
  isValidPasswordRegex,
} from "../components/UserRegex";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FaceRetouchingOffIcon from "@mui/icons-material/FaceRetouchingOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { StepSignUpFormProps } from "@/types/UserTypes";

const colors = new VariablesColors();
const { colorOrange } = colors;

const StepForm = (props: StepSignUpFormProps): React.ReactNode => {
  const theme = useTheme();
  const stepConfig = {
    email: {
      title: "Votre email ?",
      subtitle: "Si on doit vous envoyer un email.",
      icon: AlternateEmailIcon,
      Component: UserEmail,
      componentProps: {
        email: props.email,
        setEmail: props.setEmail,
      },
      isDisabled: () => props.email === "" || !isValidEmailRegex(props.email),
      nextStep: "profil",
    },
    profil: {
      title: "Votre profil ?",
      subtitle: "Pour vous proposer un contenu personnalisé",
      icon: AssignmentIndIcon,
      Component: UserProfil,
      componentProps: {
        profil: props.profil,
        setProfil: props.setProfil,
      },
      isDisabled: () => props.profil === "",
      nextStep: "gender",
    },
    gender: {
      title: "Votre civilité ?",
      subtitle: "Pour savoir comment vous appeler.",
      icon: AssignmentIndIcon,
      Component: UserGender,
      componentProps: {
        gender: props.gender,
        setGender: props.setGender,
      },
      isDisabled: () => props.gender === "",
      nextStep: "firstName",
    },
    firstName: {
      title: "Votre prénom ?",
      subtitle: "Dites nous en un peu plus sur vous.",
      icon: FingerprintIcon,
      Component: UserName,
      componentProps: {
        userName: props.firstName,
        setUserName: props.setFirstName,
        type: "firstName",
      },
      isDisabled: () =>
        props.firstName === "" || !isValidNameRegex(props.firstName),
      nextStep: "lastName",
    },
    lastName: {
      title: "Votre  nom ?",
      subtitle: `Dites nous en un peu plus sur vous, ${props.firstName}.`,
      icon: FingerprintIcon,
      Component: UserName,
      componentProps: {
        userName: props.lastName,
        setUserName: props.setLastName,
        type: "lastName",
      },
      isDisabled: () =>
        props.lastName === "" || !isValidNameRegex(props.lastName),
      nextStep: "nickName",
    },
    nickName: {
      title: "Votre  pseudo ?",
      subtitle: `Pour rester anonyme.`,
      icon: FaceRetouchingOffIcon,
      Component: UserName,
      componentProps: {
        userName: props.nickName,
        setUserName: props.setNickName,
        type: "nickName",
      },
      isDisabled: () =>
        props.lastName === "" || !isValidNameRegex(props.lastName),
      nextStep: "avatar",
    },
    avatar: {
      title: "Votre  avatar ?",
      subtitle: `Pour vous montrer comme vous le souhaitez.`,
      icon: AccountCircleIcon,
      Component: PictureDownload,
      componentProps: {
        picture: props.picture,
        setPicture: props.setPicture,
        previewUrl: props.previewUrl,
        setPreviewUrl: props.setPreviewUrl,
      },
      isDisabled: () => props.picture === null,
      nextStep: "phoneNumber",
    },
    phoneNumber: {
      title: "Votre numéro de téléphone ?",
      subtitle: "Si on doit vous appeler.",
      icon: PhoneIphoneIcon,
      Component: UserPhone,
      componentProps: {
        phoneNumber: props.phoneNumber,
        setPhoneNumber: props.setPhoneNumber,
      },
      isDisabled: () =>
        props.phoneNumber === "" || !isValidPhoneNumberRegex(props.phoneNumber),
      nextStep: "password",
    },
    password: {
      title: "Votre mot de passe ?",
      subtitle: "On ne vous embête plus après. Promis !",
      icon: LockIcon,
      Component: UserPassword,
      componentProps: {
        password: props.password,
        setPassword: props.setPassword,
      },
      isDisabled: () =>
        props.password === "" || !isValidPasswordRegex(props.password),
      nextStep: "submit",
    },
  };
  const currentConfig = stepConfig[props.currentStep];
  const isButtonDisabled = currentConfig.isDisabled();
  const StepComponent = currentConfig.Component;
  const StepIcon = currentConfig.icon;
  return (
    <Grid
      container
      item
      xs={9}
      sm={8}
      md={7}
      lg={5}
      sx={{
        display: "flex",
        margin: "auto",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
          p: 1,
          minHeight: "370px",
        },
      }}
    >
      <StepIcon sx={{ fontSize: 50, color: colorOrange }} />
      <Typography variant="h5" fontWeight={700} marginTop={3} gutterBottom>
        {currentConfig.title}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        {currentConfig.subtitle}
      </Typography>
      <Box sx={{ marginTop: "20px", marginBottom: "30px", width: "100%" }}>
        <StepComponent {...currentConfig.componentProps} />
      </Box>
      <StepFormButton
        sx={{ width: "100% " }}
        onClick={() => props.setCurrentStep(currentConfig.nextStep)}
        disabled={isButtonDisabled}
      >
        {props.currentStep === "password"
          ? "Valider mon mot de passe"
          : "Suivant"}
      </StepFormButton>
    </Grid>
  );
};

export default StepForm;
