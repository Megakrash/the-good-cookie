import React from "react";
import { TextField } from "@mui/material";

type AdDescriptionProps = {
  description: string;
  setDescription: (description: string) => void;
};

function AdDescription(props: AdDescriptionProps): React.ReactNode {
  return (
    <TextField
      className="adForm_boxForm_input"
      id="description"
      multiline
      fullWidth
      minRows={8}
      maxRows={24}
      label="Détail de votre annonce"
      variant="outlined"
      value={props.description || ""}
      onChange={(e) => props.setDescription(e.target.value)}
      required
    />
  );
}

export default AdDescription;
