import "@/styles/index.scss";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@mui/material/styles";
import { client } from "@/config/apollo-client";
import { useAuth } from "@/config/userAuth";
import { CssBaseline } from "@mui/material";
import { LoadingApp } from "@/styles/LoadingApp";
import { UserProvider } from "@/context/UserContext";
import { useRouter } from "next/router";
import BackOfficeLayout from "@/components/backoffice/layout/BackOfficeLayout";
import AppBar from "@/components/appBar/AppBar";
import theme from "@/config/themeMui";

const privatePages = ["/account", "/ads/new", "/ads/edit", "/messages"];

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
