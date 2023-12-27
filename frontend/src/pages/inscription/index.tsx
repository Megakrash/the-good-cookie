import LayoutLight from "@/components/LayoutLight";
import { Button, Typography, Link, Box } from "@mui/material";
import { PATH_IMAGE } from "@/api/configApi";

const SignPage = (): React.ReactNode => {
  return (
    <LayoutLight title="TGC : Inscription / Connexion">
      <Box
        sx={{
          height: "250px",
          display: "flex",
          color: "white",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${PATH_IMAGE}/general/avatar.png)`,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Rejoignez une communauté de confiance
        </Typography>
        <Link href="/inscription/creation">
          <Button variant="contained" size="large">
            Inscrivez-vous gratuitement
          </Button>
        </Link>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "5px",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Déjà inscrit ?
          </Typography>
          <Link variant="body2" href="/connexion">
            {"Connectez-vous"}
          </Link>
        </Box>
      </Box>
    </LayoutLight>
  );
};

export default SignPage;
