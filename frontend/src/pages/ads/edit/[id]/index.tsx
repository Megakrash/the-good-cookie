import LayoutFull from "@/components/layout/LayoutFull";
import { AdTypes } from "@/types/AdTypes";
import AdForm from "@/components/ads/adForm/AdForm";
import AdCard from "@/components/ads/AdCard";
import { queryAdById } from "@/graphql/ads/queryAdById";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";

const EditAd = (): React.ReactNode => {
  const router = useRouter();
  const adId = router.query.id;

  const { data } = useQuery<{ item: AdTypes }>(queryAdById, {
    variables: {
      adByIdId: adId,
    },
    skip: adId === undefined,
  });
  const ad = data ? data.item : null;

  return (
    <LayoutFull title="Modifier mon annonce">
      {ad && (
        <Box
          sx={{
            width: "98%",
            marginTop: { xs: "15px", md: "50px" },
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: "98%", md: "50%" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <AdForm ad={ad} />
          </Box>
          <Box
            sx={{
              width: { xs: "98%", md: "40%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 1,
              gap: 2,
            }}
          >
            <Typography variant="h4" textAlign="center">
              Votre annonce actuelle
            </Typography>
            <AdCard key={ad.id} ad={ad} />
          </Box>
        </Box>
      )}
    </LayoutFull>
  );
};

export default EditAd;
