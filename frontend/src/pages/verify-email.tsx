import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { mutationVerifyEmail } from "../components/graphql/Users";

type UserEmailVerify = {
  success: boolean;
  message: string;
};

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [verified, setVerified] = useState(false);
  const [verifyEmail, { loading, error }] = useMutation<{
    item: UserEmailVerify;
  }>(mutationVerifyEmail, {
    variables: { token },
    onCompleted: (data) => {
      if (data.item.success === true) {
        toast.success(data.item.message);
        setVerified(true);
      } else {
        toast.error(data.item.message);
      }
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token, verifyEmail]);

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", paddingTop: "2rem" }}>
      <Toaster
        toastOptions={{
          style: {
            background: "#ff8a00",
            color: "#fff",
          },
        }}
      />
      <Typography variant="h4">{`Vérification de l'Email`}</Typography>
      {loading ? (
        <CircularProgress />
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
        sx={{ marginTop: "1rem" }}
      >
        {`Retour à l'accueil`}
      </Button>
    </Container>
  );
};

export default VerifyEmail;
