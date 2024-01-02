import React, { useState } from "react";
import { Button, Card, FormControl, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import UserEmail from "../userForm/components/UserEmail";
import UserPassword from "../userForm/components/UserPassword";
import { mutationUserLogin } from "@/components/graphql/Users";
import { useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
import router from "next/router";

const UserConnection = (): React.ReactNode => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handlePasswordChange = (newPassword: React.SetStateAction<string>) => {
    setPassword(newPassword);
  };
  const [doLogin] = useMutation(mutationUserLogin);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await doLogin({
        variables: { data: { email, password } },
      });
      if ("id" in data.item) {
        router.replace(`/compte`);
        toast(`Connexion réussie, bienvenue ${data.item.nickName}`, {
          style: { background: "#0fcc45", color: "#fff" },
        });
      }
    } catch (error) {
      toast("Email ou mot de passe incorrect", {
        style: { background: "#e14d2a", color: "#fff" },
      });
      setEmail("");
      setPassword("");
    }
  };

  return (
    <Card className="userForm userSignin">
      <Toaster />
      <Typography variant="h4" gutterBottom>
        Connexion
      </Typography>
      <FormControl
        className="userForm_control"
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <UserEmail email={email} setEmail={setEmail} />
        <UserPassword
          password={password}
          onPasswordChange={handlePasswordChange}
        />
        <Button
          variant="contained"
          size="large"
          type="submit"
          endIcon={<LoginIcon />}
        >
          Connexion
        </Button>
      </FormControl>
    </Card>
  );
};

export default UserConnection;
