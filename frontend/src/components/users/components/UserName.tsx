import React, { useState } from "react";
import { TextField } from "@mui/material";
import { isValidNameRegex } from "../components/UserRegex";

type UserNameType = "firstName" | "lastName" | "nickName";

type UserNameProps = {
  userName: string;
  setUserName: (firstName: string) => void;
  type: UserNameType;
};

const UserName = (props: UserNameProps): React.ReactNode => {
  const [nameError, setNameError] = useState<string>("");

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    props.setUserName(value);
    if (!isValidNameRegex(value)) {
      setNameError("Ne doit contenir que des lettres (minimum 2, maximum 50)");
    } else {
      setNameError("");
    }
  };

  return (
    <TextField
      fullWidth
      id={props.type}
      size="small"
      label={
        props.type === "firstName"
          ? "Prénom"
          : props.type === "lastName"
            ? "Nom"
            : "Pseudo"
      }
      variant="outlined"
      value={props.userName}
      onChange={handleFirstNameChange}
      required
      error={!!nameError}
      helperText={nameError}
    />
  );
};

export default UserName;
