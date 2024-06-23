import React, { useState } from "react";
import { TextField } from "@mui/material";
import { isValidNameRegex } from "@/components/users/components/UserRegex";

type BackOfficeInputProps = {
  data: string;
  setData: (data: string) => void;
  label: string;
};

const BackOfficeInput = (props: BackOfficeInputProps): React.ReactNode => {
  const [error, setError] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    props.setData(value);
    if (!isValidNameRegex(value)) {
      setError("Ne doit contenir que des lettres (minimum 2, maximum 50)");
    } else {
      setError("");
    }
  };

  return (
    <TextField
      fullWidth
      id={props.label}
      size="small"
      label={props.label}
      variant="outlined"
      value={props.data}
      onChange={handleChange}
      required
      error={!!error}
      helperText={error}
    />
  );
};

export default BackOfficeInput;
