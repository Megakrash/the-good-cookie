import LayoutFull from "@/components/layout/LayoutFull";
import AdForm from "@/components/ads/adForm/AdForm";
import { Box } from "@mui/material";

function NewAd(): React.ReactNode {
  return (
    <LayoutFull title="TGD : Créer mon annonce">
      <Box
        sx={{
          width: { xs: "98%", md: "60%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "auto",
          padding: 1,
        }}
      >
        <AdForm />
      </Box>
    </LayoutFull>
  );
}

export default NewAd;
