import React, { ChangeEvent, useState } from "react";
import { TextField, Typography } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";

type UserPasswordProps = {
  password: string;
  onPasswordChange: (newPassword: string) => void;
};

const UserPassword = (props: UserPasswordProps): React.ReactNode => {
  const [touched, setTouched] = useState(false);

  const validatePassword = (password: string) => {
    return {
      "9 caractères minimum": password.length >= 9,
      "Un nombre": /\d/.test(password),
      "Un caractère en majuscule": /[A-Z]/.test(password),
      "Un caractère en minuscule": /[a-z]/.test(password),
    };
  };

  const [passwordCriteria, setPasswordCriteria] = useState({
    "9 caractères minimum": false,
    "Un nombre": false,
    "Un caractère en majuscule": false,
    "Un caractère en minuscule": false,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    if (!touched) setTouched(true);
    props.onPasswordChange(newPassword);
    setPasswordCriteria(validatePassword(newPassword));
  };
  const showError = touched && !Object.values(passwordCriteria).every(Boolean);
  return (
    <>
      <TextField
        type="password"
        label="Mot de passe"
        variant="outlined"
        size="small"
        value={props.password}
        onChange={handleChange}
        error={showError}
        required
      />
      {props.password !== "" && (
        <>
          {Object.entries(passwordCriteria).map(([criteria, check]) => (
            <Typography
              key={criteria}
              variant="caption"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {check ? (
                <CheckCircle color="success" />
              ) : (
                <Error color="error" />
              )}
              {` ${criteria}`}
            </Typography>
          ))}
        </>
      )}
    </>
  );
};

export default UserPassword;
