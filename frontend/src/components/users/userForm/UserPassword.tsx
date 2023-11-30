import React, { ChangeEvent, useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

type UserPasswordProps = {
  password: string;
  onPasswordChange: (newPassword: string) => void;
};

const UserPassword = (props: UserPasswordProps): React.ReactNode => {
  // Criteria & errors
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

  // See the password
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <TextField
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        size="small"
        label="Mot de passe"
        variant="outlined"
        value={props.password}
        onChange={handleChange}
        error={showError}
        required
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {props.password !== "" && (
        <Box
          sx={{
            width: "100%",
            margin: "auto",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {Object.entries(passwordCriteria).map(([criteria, check]) => (
            <Typography
              key={criteria}
              variant="caption"
              sx={{
                display: "flex",
                width: "40%",
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
        </Box>
      )}
    </>
  );
};

export default UserPassword;
