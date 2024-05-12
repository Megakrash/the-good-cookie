import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Avatar, Box, Button, Divider, Grid, Typography } from "@mui/material";
import { mutationCreateUser } from "@/components/graphql/Users";
import { UserFormData } from "@/types/UserTypes";
import { useMutation } from "@apollo/client";
import StepForm from "./StepForm";
import { VariablesColors } from "@/styles/Variables.colors";
import StepWelcome from "./StepWelcome";
import StepSubmit from "./StepSubmit";
import axios from "axios";
import { API_URL } from "@/api/configApi";

const colors = new VariablesColors();
const { colorWhite, colorLightGrey, errorColor } = colors;

const SignUp = (): React.ReactNode => {
  // Form
  const [email, setEmail] = useState<string>("");
  const [profil, setProfil] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [picture, setPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const hidenPassword = (): string => {
    const length = password.length;
    const hidenPassword = "*".repeat(length);
    return hidenPassword;
  };
  // FORM STEPS
  const [currentStep, setCurrentStep] = useState<string>("email");
  const formSteps = [
    { step: "email", title: "Votre email", data: email },
    { step: "profil", title: "Votre profil", data: profil },
    {
      step: "gender",
      title: "Votre civilité",
      data:
        gender === "MAN"
          ? "Monsieur"
          : gender === "WOMAN"
            ? "Madame"
            : gender === "OTHER" && "Indéterminée",
    },
    { step: "firstName", title: "Votre prénom", data: firstName },
    { step: "lastName", title: "Votre nom", data: lastName },
    { step: "nickName", title: "Votre pseudo", data: nickName },
    { step: "avatar", title: "Votre avatar", data: previewUrl },
    {
      step: "phoneNumber",
      title: "Votre numéro de téléphone",
      data: phoneNumber,
    },
    { step: "password", title: "Votre mot de passe", data: password },
  ];

  // SUBMIT
  const [doCreate, loading] = useMutation(mutationCreateUser);
  async function onSubmit() {
    const dataFile = new FormData();
    dataFile.append("title", nickName);
    dataFile.append("file", picture);
    try {
      let pictureId: number | null = null;
      if (picture) {
        const uploadResponse = await axios.post(`${API_URL}picture`, dataFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        pictureId = uploadResponse.data.id;
      }
      const data: UserFormData = {
        email,
        profil,
        gender,
        firstName,
        lastName,
        nickName,
        password,
        phoneNumber,
        ...(pictureId && { pictureId }),
      };

      const result = await doCreate({
        variables: {
          data,
        },
      });
      if ("id" in result.data?.item) {
        setCurrentStep("welcome");
      } else {
        toast("Erreur pendant la création de votre compte", {
          style: { background: errorColor, color: colorWhite },
        });
        setCurrentStep("email");
      }
    } catch (error) {
      toast("Erreur pendant la création de votre compte", {
        style: { background: errorColor, color: colorWhite },
      });
      console.error("error", error);
      setCurrentStep("email");
    }
  }

  return (
    <>
      {currentStep === "welcome" ? (
        <StepWelcome email={email} />
      ) : (
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Toaster />
          <Grid
            item
            xs={6}
            sm={4}
            md={3.5}
            lg={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: colorLightGrey,
              height: "89vh",
              padding: "1%",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              marginBottom={"25px"}
              gutterBottom
            >
              Vos informations
            </Typography>
            {formSteps.map((el) => (
              <Box
                key={el.step}
                sx={{ marginBottom: "5px", minHeight: "65px" }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {el.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {el.step === "password" ? (
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      {!el.data ? "-" : hidenPassword()}
                    </Typography>
                  ) : el.step === "avatar" ? (
                    <Avatar
                      alt="User avatar"
                      src={el.data}
                      sx={{
                        width: "35px",
                        height: "35px",
                        marginBottom: "5px",
                      }}
                    />
                  ) : (
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      {el.data ? el.data : "-"}
                    </Typography>
                  )}
                  {el.data && el.step !== currentStep && (
                    <Button onClick={() => setCurrentStep(el.step)}>
                      Modifier
                    </Button>
                  )}
                </Box>
                <Divider />
              </Box>
            ))}
          </Grid>
          <Grid item xs={6} sm={6} md={8.5}>
            {currentStep === "submit" ? (
              <StepSubmit onSubmit={onSubmit} loading={loading.loading} />
            ) : (
              <StepForm
                email={email}
                setEmail={setEmail}
                profil={profil}
                setProfil={setProfil}
                gender={gender}
                setGender={setGender}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                nickName={nickName}
                setNickName={setNickName}
                picture={picture}
                setPicture={setPicture}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                password={password}
                setPassword={setPassword}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default SignUp;
