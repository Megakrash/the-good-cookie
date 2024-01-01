import React, { useState } from "react";
import { Button, Card, FormControl, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import UserEmail from "../userForm/components/UserEmail";
import UserPassword from "../userForm/components/UserPassword";

const UserConnection = (): React.ReactNode => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handlePasswordChange = (newPassword: React.SetStateAction<string>) => {
    setPassword(newPassword);
  };
  return (
    <Card className="userForm">
      <Typography variant="h4" gutterBottom>
        Connexion
      </Typography>
      <FormControl
        className="userForm_control"
        component="form"
        autoComplete="off"
        // onSubmit={onSubmit}
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
