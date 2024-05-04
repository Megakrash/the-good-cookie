import React from "react";
import {
  Radio,
  RadioProps,
  FormControlLabel,
  FormControlLabelProps,
  styled,
  Grid,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PersonIcon from "@mui/icons-material/Person";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";

import { VariablesColors } from "./Variables.colors";

const colors = new VariablesColors();
const { colorLightGrey, colorDarkGrey, colorWhite, colorOrange, successColor } =
  colors;

const iconList = {
  pro: EngineeringIcon,
  particular: PersonIcon,
  man: ManIcon,
  woman: WomanIcon,
  alien: SelfImprovementIcon,
};

interface CustomRadioButtonProps
  extends Omit<FormControlLabelProps, "control"> {
  label: string;
  icon: keyof typeof iconList;
  radioProps?: RadioProps;
}

export const CustomRadioButton = (props: CustomRadioButtonProps) => {
  const CustomRadio = styled(Radio)<RadioProps>(() => ({
    "&.MuiRadio-root": {
      color: colorLightGrey,
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-checked": {
      color: colorOrange,
    },
    "& .MuiSvgIcon-root": {
      boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.3)",
      borderRadius: "50%",
    },
  }));

  const currentIcon = iconList[props.icon];

  const StepIcon = currentIcon;

  return (
    <Grid
      container
      item
      xs={12}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        borderRadius: "10px",
        backgroundColor: colorLightGrey,
        color: colorDarkGrey,
        fontWeight: "600",
        maxWidth: "fit-content",
        minWidth: "160px",
        minHeight: "60px",
        border: "none",
        outline: "none",
        cursor: "pointer",
        padding: "0 1rem",
      }}
    >
      <StepIcon
        sx={{
          fontSize: 40,
          color: colorOrange,
        }}
      />
      <FormControlLabel
        {...props}
        label={props.label}
        labelPlacement="start"
        sx={{ marginTop: "5px" }}
        control={
          <CustomRadio
            {...props.radioProps}
            icon={<CheckCircleOutlineIcon />}
            checkedIcon={<CheckCircleIcon />}
          />
        }
      />
    </Grid>
  );
};
