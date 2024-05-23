import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const { colorWhite, successColor, errorColor } = colors;

export const toastStyles = {
  success: {
    style: { background: successColor, color: colorWhite },
    iconTheme: { primary: colorWhite, secondary: successColor },
  },
  error: {
    style: { background: errorColor, color: colorWhite },
    iconTheme: { primary: colorWhite, secondary: errorColor },
  },
};
