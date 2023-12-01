import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "@/styles/index.scss";

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
  uri: "http://localhost:5000/",
  cache: new InMemoryCache(),
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
