import React from "react";
import {
  Switch,
  FormControlLabel,
  Typography,
  Box,
  styled,
} from "@mui/material";
import { VariablesColors } from "@/styles/Variables.colors";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const colors = new VariablesColors();
const { successColor, errorColor } = colors;

type DisplaySwitchProps = {
  display: boolean | null;
  setDisplay: (display: boolean | null) => void;
};

const CustomSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    color: errorColor,
    "&.Mui-checked": {
      color: successColor,
    },
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: successColor,
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: errorColor,
  },
}));

const DisplaySwitch: React.FC<DisplaySwitchProps> = ({
  display,
  setDisplay,
}) => {
  const handleChange = () => {
    setDisplay(!display);
  };

  return (
    <FormControlLabel
      sx={{ width: "100%" }}
      control={
        <CustomSwitch
          checked={display === true}
          onChange={handleChange}
          color="success"
          inputProps={{ "aria-label": "controlled" }}
        />
      }
      label={
        <Box sx={{ display: "flex" }}>
          {display ? (
            <CheckCircleIcon
              style={{
                color: successColor,
              }}
            />
          ) : (
            <CancelIcon
              style={{
                color: errorColor,
              }}
            />
          )}

          <Typography
            variant="body1"
            style={{ color: display ? successColor : errorColor }}
          >
            {display ? "En ligne" : "Hors ligne"}
          </Typography>
        </Box>
      }
      labelPlacement="end"
    />
  );
};

export default DisplaySwitch;
