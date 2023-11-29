import React, { FormEvent, useState } from "react";
import UserPassword from "./UserPassword";
import { Box, Button, FormControl, TextField, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { mutationCreateUser } from "@/components/graphql/Users";
import { UserFormData } from "@/types";
import axios from "axios";
import { API_URL } from "@/configApi";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import router from "next/router";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const UserForm = (): React.ReactNode => {
  // Form
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handlePasswordChange = (newPassword: React.SetStateAction<string>) => {
    setPassword(newPassword);
  };
  const [adress, setAdress] = useState<string>("");
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
  const [doCreate] = useMutation(mutationCreateUser);
  // SUBMIT
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
        picture: filename,
        adress,
        zipCode,
        city,
        phoneNumber,
        isAdmin: false,
      };

      const result = await doCreate({
        variables: {
          data: data,
        },
      });
      if ("id" in result.data?.item) {
        router.replace(`/compte/${result.data.item.id}`);
      } else {
        toast("Erreur pendant la création de votre compte");
      }
    } catch (error) {
      console.error("error", error);
    }
  }
  return (
    <Box>
      <Toaster
        toastOptions={{
          style: {
            background: "#ff8a00",
            color: "#fff",
          },
        }}
      />
      <FormControl component="form" autoComplete="off" onSubmit={onSubmit}>
        <TextField
          id="firstName"
          size="small"
          label="Prénom"
          variant="outlined"
          value={firstName || ""}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <TextField
          id="lastName"
          size="small"
          label="Nom"
          variant="outlined"
          value={lastName || ""}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <TextField
          id="pseudo"
          size="small"
          label="Pseudo"
          variant="outlined"
          value={nickName || ""}
          onChange={(e) => setNickName(e.target.value)}
          required
        />
        <TextField
          id="email"
          type="email"
          size="small"
          label="Email"
          variant="outlined"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <UserPassword
          password={password}
          onPasswordChange={handlePasswordChange}
        />
        <TextField
          id="adress"
          size="small"
          label="Adresse"
          variant="outlined"
          value={adress || ""}
          onChange={(e) => setAdress(e.target.value)}
        />
        <TextField
          id="zipCode"
          size="small"
          label="Code postal"
          variant="outlined"
          value={zipCode || ""}
          onChange={(e) => setZipCode(e.target.value)}
        />
        <TextField
          id="city"
          size="small"
          label="Ville"
          variant="outlined"
          value={city || ""}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <TextField
          id="phoneNumber"
          type="tel"
          size="small"
          label="Téléphone"
          variant="outlined"
          value={phoneNumber || ""}
          onChange={(e) => {
            const inputNumber = e.target.value;
            const regex = /^[0-9]*$/;
            if (regex.test(inputNumber)) {
              setPhoneNumber(inputNumber);
            }
          }}
          inputProps={{
            maxLength: 10,
          }}
        />
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Avatar
          <VisuallyHiddenInput
            type="file"
            accept=".jpg, .png, .webp"
            onChange={handleFileSelection}
            required
          />
        </Button>
        <Button variant="contained" size="large" type="submit">
          Créer mon compte
        </Button>
      </FormControl>
    </Box>
  );
};

export default UserForm;
