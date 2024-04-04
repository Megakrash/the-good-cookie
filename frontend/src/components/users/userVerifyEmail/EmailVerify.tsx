import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import {
  Card,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { mutationVerifyEmail } from "@/components/graphql/Users";
import { GreyBtnOrangeHover } from "@/styles/MuiButtons";

type UserEmailVerify = {
  success: boolean;
  message: string;
};

const EmailVerify = () => {
  const theme = useTheme();
  const router = useRouter();
  const { token } = router.query;
  const [requestSend, setRequestSend] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifyEmail, { loading, error }] = useMutation<{
    item: UserEmailVerify;
  }>(mutationVerifyEmail, {
    variables: { token },
    onCompleted: (data) => {
      if (data.item.success === true) {
        toast(data.item.message, {
          style: { background: "#e89116", color: "#fff" },
        });
        setVerified(true);
      } else {
        toast.error(data.item.message);
      }
    },
  });

  useEffect(() => {
    if (token && !requestSend) {
      verifyEmail();
      setRequestSend(true);
    }
  }, [token]);

  return (
    <Grid
      container
      item
      xs={12}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginTop: "1%",
        gap: "1rem",
      }}
    >
      <Typography variant="h4">{`Vérification de l'Email`}</Typography>
      <Card
        sx={{
          minWidth: "350px",
          padding: "3%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "1.5rem",
        }}
      >
        <Toaster />

        {loading ? (
          <CircularProgress size={60} />
        ) : (
          <Typography>
            {verified
              ? "Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter."
              : "Vérification en cours..."}
          </Typography>
        )}
        {error && (
          <Typography color="error">{`Une erreur s'est produite.`}</Typography>
        )}
        <GreyBtnOrangeHover
          onClick={() => router.push("/signin")}
          disabled={!verified}
          sx={{ marginTop: "1rem" }}
        >
          Connexion
        </GreyBtnOrangeHover>
      </Card>
    </Grid>
  );
};

export default EmailVerify;
