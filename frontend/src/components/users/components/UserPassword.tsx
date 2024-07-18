import React, { ChangeEvent, useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

type UserPasswordProps = {
  password: string;
  setPassword: (email: string) => void;
  label?: string;
};

function UserPassword(props: UserPasswordProps): React.ReactNode {
  const theme = useTheme();
  // Criteria & errors
  const [touched, setTouched] = useState<Boolean>(false);
  const validatePassword = (password: string) => {
    return {
      "9 caractères minimum": password.length >= 9,
      "Un nombre": /\d/.test(password),
      "Majuscule et minuscule":
        /[A-Z]/.test(password) && /[a-z]/.test(password),
      "Un caractère spécial":
        /[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\;\:\'\"\\\|\,\.\/\<\>\?]/.test(
          password,
        ),
    };
  };

  const [passwordCriteria, setPasswordCriteria] = useState({
    "9 caractères minimum": false,
    "Un nombre": false,
    "Majuscule et minuscule": false,
    "Un caractère spécial": false,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    if (!touched) setTouched(true);
    props.setPassword(newPassword);
    setPasswordCriteria(validatePassword(newPassword));
  };
  const showError = touched && !Object.values(passwordCriteria).every(Boolean);

  // See the password
  const [showPassword, setShowPassword] = useState<Boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <TextField
        id={props.label ? props.label : "outlined-adornment-password"}
        type={showPassword ? "text" : "password"}
        size="small"
        label={props.label ? props.label : "Mot de passe"}
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
            justifyContent: "space-between",
            [theme.breakpoints.down("sm")]: {
              flexDirection: "column",
            },
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
                gap: "5px",
                [theme.breakpoints.down("sm")]: {
                  width: "100%",
                },
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
}

export default UserPassword;
