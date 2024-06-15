import { createTheme } from "@mui/material/styles";
import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const {
  colorWhite,
  colorOrange,
  colorLightOrange,
  colorDarkOrange,
  colorLightGrey,
  colorDarkGrey,
} = colors;

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    h1: {
      fontFamily: ["Poppins-Medium", "sans-serif"].join(","),
    },
    h2: {
      fontFamily: ["Poppins-Medium", "sans-serif"].join(","),
    },
    h3: {
      fontFamily: ["Poppins-Medium", "sans-serif"].join(","),
    },
    h4: {
      fontFamily: ["Poppins-Medium", "sans-serif"].join(","),
    },
    h5: {
      fontFamily: ["Poppins-Medium", "sans-serif"].join(","),
    },
  },
  palette: {
    mode: "light",
    background: { default: colorWhite },
    primary: {
      main: colorOrange,
      light: colorLightOrange,
      dark: colorDarkOrange,
    },
    secondary: { main: colorDarkGrey, light: "#5C6166", dark: "#24282C" },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundColor: colorLightGrey } } },
  },
});

export default theme;
