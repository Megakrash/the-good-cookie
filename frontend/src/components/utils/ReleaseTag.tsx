import React from "react";
import { MenuItem, Typography } from "@mui/material";
import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const { colorOrange } = colors;

const ReleaseTag = (): React.ReactNode => {
  return (
    <MenuItem>
      <Typography
        sx={{
          color: colorOrange,
          fontSize: "10px",
        }}
      >
        {process.env.NEXT_PUBLIC_RELEASE_TAG}
      </Typography>
    </MenuItem>
  );
};

export default ReleaseTag;
