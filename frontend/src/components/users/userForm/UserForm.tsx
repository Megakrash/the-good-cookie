import React, { FormEvent, useState } from "react";
import axios from "axios";
import UserName from "./UserName";
import UserPassword from "./UserPassword";
import UserZipCity from "./UserZipCity";
import UserEmail from "./UserEmail";
import UserPhone from "./UserPhone";
import toast, { Toaster } from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  FormControl,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { mutationCreateUser } from "@/components/graphql/Users";
import { UserFormData } from "@/types/types";
import { API_URL } from "@/api/configApi";
import { useMutation } from "@apollo/client";
import router from "next/router";
import { DownloadInput } from "@/styles/MuiStyled";

const UserForm = (): React.ReactNode => {
  // Form
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handlePasswordChange = (newPassword: React.SetStateAction<string>) => {
    setPassword(newPassword);
  };
  const [zipCode, setZipCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [picture, setPicture] = useState<File | null>(null);
  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setPicture(event.target.files[0]);
    }
  }
  // SUBMIT
  const [doCreate] = useMutation(mutationCreateUser);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dataFile = new FormData();
    dataFile.append("title", nickName);
    dataFile.append("file", picture);

    try {
      let filename: string;
      if (picture) {
        const uploadResponse = await axios.post(`${API_URL}avatar`, dataFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        filename = uploadResponse.data.filename;
      }

      const data: UserFormData = {
        firstName,
        lastName,
        nickName,
        email,
        password,
        picture: filename ? filename : "",
        zipCode,
        city,
        isAdmin: false,
        ...(phoneNumber !== "" && { phoneNumber }),
      };

      const result = await doCreate({
        variables: {
          data: data,
        },
      });
      if ("id" in result.data?.item) {
        router.replace(`/connexion`);
      } else {
        toast("Erreur pendant la création de votre compte");
      }
    } catch (error) {
      toast("Erreur pendant la création de votre compte");
      console.error("error", error);
    }
  }
  return (
    <Card className="userForm">
      <Toaster
        toastOptions={{
          style: {
            background: "#ff8a00",
            color: "#fff",
          },
        }}
      />
      <Typography variant="h4" gutterBottom>
        Création de votre compte
      </Typography>
      <FormControl
        className="userForm_control"
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <UserName
          lastName={lastName}
          firstName={firstName}
          setFirstName={setFirstName}
          setLastName={setLastName}
        />
        <Box className="userForm_control_box">
          <TextField
            fullWidth
            id="pseudo"
            size="small"
            label="Pseudo"
            variant="outlined"
            value={nickName || ""}
            onChange={(e) => setNickName(e.target.value)}
            required
          />
          <UserEmail email={email} setEmail={setEmail} />
        </Box>
        <UserPassword
          password={password}
          onPasswordChange={handlePasswordChange}
        />
        <Box className="userForm_control_box">
          <UserZipCity setCity={setCity} setZipCode={setZipCode} />
          <UserPhone
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        </Box>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          {`Télécharger une image de profil`}
          <DownloadInput
            type="file"
            accept=".jpg, .png, .webp"
            onChange={handleFileSelection}
          />
        </Button>
        <Button variant="contained" size="large" type="submit">
          Créer mon compte
        </Button>
        <Box className="userForm_control_boxConnect">
          <Typography variant="subtitle2" gutterBottom>
            Déjà inscrit ?
          </Typography>
          <Link variant="body2" href="/inscription/connexion">
            {"Connectez-vous"}
          </Link>
        </Box>
      </FormControl>
    </Card>
  );
};

export default UserForm;
