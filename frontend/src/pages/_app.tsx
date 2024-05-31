import "@/styles/index.scss";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { client } from "@/config/apollo-client";
import { useAuth } from "@/config/userAuth";
import { CssBaseline } from "@mui/material";
import { LoadingApp } from "@/styles/LoadingApp";
import { VariablesColors } from "@/styles/Variables.colors";
import { UserProvider } from "@/context/UserContext";
import { useRouter } from "next/router";
import BackOfficeLayout from "@/components/backoffice/layout/BackOfficeLayout";
import AppBar from "@/components/appBar/AppBar";

const colors = new VariablesColors();
const { colorWhite, colorOrange, colorLightOrange, colorDarkOrange } = colors;

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
    secondary: { main: "#343a40", light: "#5C6166", dark: "#24282C" },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundColor: "#F8F8F8" } } },
  },
});
const privatePages = ["/account", "/ads/new"];

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth(privatePages);
  if (loading) return <LoadingApp />;
  return children;
};

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isBackOffice = router.pathname.startsWith("/tgc-backoffice");
  const LayoutBackOffice = isBackOffice ? BackOfficeLayout : React.Fragment;
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <AuthProvider>
            <CssBaseline />
            {!isBackOffice && <AppBar />}
            <LayoutBackOffice>
              <Component {...pageProps} />
            </LayoutBackOffice>
          </AuthProvider>
        </UserProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
