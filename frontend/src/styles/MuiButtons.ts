import { styled } from "@mui/material";
import { VariablesColors } from "./Variables.colors";

const colors = new VariablesColors();
const { colorWhite, colorDarkGrey, colorGrey, colorOrange, colorLightOrange } =
  colors;

interface ButtonsHoverProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const GreyBtnOrangeHover = styled("button")<ButtonsHoverProps>(() => ({
  borderRadius: "10px",
  backgroundColor: colorGrey,
  color: colorWhite,
  fontWeight: "600",
  maxWidth: "fit-content",
  minWidth: "160px",
  minHeight: "40px",
  border: "none",
  outline: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition:
    "background-color 0.3s ease, color 0.3s ease, font-weight 0.3s ease",
  "&:hover": {
    backgroundColor: colorOrange,
    color: colorWhite,
    border: `1px solid ${colorWhite}`,
  },
  "&:disabled": {
    cursor: "not-allowed",
    backgroundColor: colorDarkGrey,
    color: colorWhite,
  },
}));

export const StepFormButton = styled("button")<ButtonsHoverProps>(() => ({
  borderRadius: "10px",
  backgroundColor: colorGrey,
  color: colorWhite,
  fontWeight: "600",
  minWidth: "160px",
  minHeight: "40px",
  border: "none",
  outline: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition:
    "background-color 0.4s ease, color 0.4s ease, font-weight 0.4s ease",
  "&:hover": {
    backgroundColor: colorOrange,
  },
  "&:disabled": {
    cursor: "not-allowed",
    backgroundColor: colorDarkGrey,
  },
}));

export const OrangeBtnOrangeHover = styled("button")<ButtonsHoverProps>(() => ({
  borderRadius: "10px",
  backgroundColor: colorOrange,
  color: colorWhite,
  fontSize: "1.2rem",
  fontWeight: "600",
  maxWidth: "fit-content",
  minWidth: "300px",
  minHeight: "45px",
  border: "none",
  outline: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition:
    "background-color 0.3s ease, color 0.3s ease, font-weight 0.3s ease",
  "&:hover": {
    backgroundColor: colorLightOrange,
    color: colorWhite,
    border: `1px solid ${colorWhite}`,
  },
}));

export const DarkGreyBtnGreyHover = styled("button")<ButtonsHoverProps>(() => ({
  borderRadius: "10px",
  backgroundColor: colorDarkGrey,
  color: colorWhite,
  fontSize: "1.2rem",
  fontWeight: "600",
  maxWidth: "fit-content",
  minWidth: "300px",
  minHeight: "45px",
  border: "none",
  outline: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition:
    "background-color 0.3s ease, color 0.3s ease, font-weight 0.3s ease",
  "&:hover": {
    backgroundColor: colorGrey,
    color: colorWhite,
    border: `1px solid ${colorWhite}`,
  },
}));
