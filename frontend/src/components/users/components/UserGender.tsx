import React from "react";
import { CustomRadioButton } from "@/styles/MuiRadio";
import { Box } from "@mui/material";

type UserGenderProps = {
  gender: string;
  setGender: (gender: string) => void;
};

const UserGender = (props: UserGenderProps): React.ReactNode => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setGender(event.target.value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <CustomRadioButton
        icon="man"
        label="Monsieur"
        checked={props.gender === "Monsieur"}
        onChange={handleChange}
        value="Monsieur"
      />
      <CustomRadioButton
        icon="woman"
        label="Madame"
        checked={props.gender === "Madame"}
        onChange={handleChange}
        value="Madame"
      />
      <CustomRadioButton
        icon="alien"
        label="Autre"
        checked={props.gender === "Autre"}
        onChange={handleChange}
        value="Autre"
      />
    </Box>
  );
};

export default UserGender;
