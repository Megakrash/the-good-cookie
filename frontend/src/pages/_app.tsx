import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UserContext from "@/context/UserContext";
import { CssBaseline } from "@mui/material";
import "@/styles/index.scss";
import { useState } from "react";
import { UserTypes } from "@/types/types";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f5f5f5",
    },
    primary: {
      main: "#ffa41b",
      light: "#FFB648",
      dark: "#e89116",
    },
    secondary: {
      main: "#343a40",
      light: "#5C6166",
      dark: "#24282C",
    },
  },
});
const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:5000/",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<UserTypes | null>(null);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user, setUser }}>
          <CssBaseline />
          <Component {...pageProps} />
        </UserContext.Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
