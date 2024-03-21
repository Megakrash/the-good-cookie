import React, { useState } from "react";
import { TextField } from "@mui/material";
import { isValidEmailRegex } from "./UserRegex";

type UserEmailProps = {
  email: string;
  setEmail: (email: string) => void;
};

const UserEmail = (props: UserEmailProps): React.ReactNode => {
  const [emailError, setEmailError] = useState<string>("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    props.setEmail(email);
    if (!isValidEmailRegex(email)) {
      setEmailError("Doit être une adresse email valide");
    } else {
      setEmailError("");
    }
  };
  return (
    <TextField
      id="email"
      type="email"
      size="small"
      label="Email"
      variant="outlined"
      error={!!emailError}
      helperText={emailError}
      fullWidth
      value={props.email || ""}
      onChange={handlePasswordChange}
      required
    />
  );
};

export default UserEmail;
