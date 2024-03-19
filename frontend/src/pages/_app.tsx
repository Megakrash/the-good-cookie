import '@/styles/index.scss';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  useQuery,
} from '@apollo/client';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress, CssBaseline, Typography } from '@mui/material';
import { queryMeContext } from '@/components/graphql/Users';
import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserContextTypes } from '@/types/UserTypes';
import Header from '@/components/appBar/AppBar';
import { API_URL } from '@/api/configApi';

const theme = createTheme({
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
    h1: {
      fontFamily: ['Poppins-Medium', 'sans-serif'].join(','),
    },
    h2: {
      fontFamily: ['Poppins-Medium', 'sans-serif'].join(','),
    },
    h3: {
      fontFamily: ['Poppins-Medium', 'sans-serif'].join(','),
    },
    h4: {
      fontFamily: ['Poppins-Medium', 'sans-serif'].join(','),
    },
    h5: {
      fontFamily: ['Poppins-Medium', 'sans-serif'].join(','),
    },
  },

  palette: {
    mode: 'light',
    background: {
      default: 'FFFFFF',
    },
    primary: {
      main: '#FF8E3C',
      light: '#FFB648',
      dark: '#e89116',
    },
    secondary: {
      main: '#343a40',
      light: '#5C6166',
      dark: '#24282C',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#F8F8F8',
        },
      },
    },
  },
});
const client = new ApolloClient({
  link: new HttpLink({
    uri: API_URL || 'http://localhost:5000/',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});

const privatePages = ['/compte', '/annonces/new'];

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loading, error, refetch } = useQuery<{
    item: UserContextTypes;
  }>(queryMeContext);
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      if (privatePages.includes(router.pathname)) {
        refetch();
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, refetch]);

  useEffect(() => {
    if (privatePages.includes(router.pathname) && error) {
      router.replace('/signin');
    }
  }, [router, error]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <CircularProgress size={164} />
        <Typography variant="h4" gutterBottom>
          Chargement...
        </Typography>
      </Box>
    );
  }

  return children;
}

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CssBaseline />
          <Header />
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
