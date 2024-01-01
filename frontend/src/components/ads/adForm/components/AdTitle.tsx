import React, { useState } from "react";
import { TextField } from "@mui/material";

type AdTitleProps = {
  title: string;
  setTitle: (title: string) => void;
};

const AdTitle = (props: AdTitleProps): React.ReactNode => {
  const [titleError, setTitleError] = useState<string>("");

  const validateTitle = (title: string) =>
    /^[\wÀ-ÿ- !@#$%^&*()_+`~{}\[\]:;"'<>,.?\/\\|=]{4,}$/.test(title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    props.setTitle(value);
    if (!validateTitle(value)) {
      setTitleError("Taille minimum 4 caractères");
    } else {
      setTitleError("");
    }
  };

  return (
    <TextField
      className="adForm_boxForm_input"
      id="title"
      size="small"
      label="Titre de votre annonce"
      variant="outlined"
      value={props.title || ""}
      onChange={handleTitleChange}
      required
      error={!!titleError}
      helperText={titleError}
    />
  );
};

export default AdTitle;
