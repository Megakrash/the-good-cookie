import LayoutFull from "@/components/layout/LayoutFull";
import { AdTypes } from "@/types/AdTypes";
import AdForm from "@/components/ads/adForm/AdForm";
import AdCard from "@/components/ads/AdCard";
import { queryAdById } from "@/components/graphql/Ads";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Box } from "@mui/material";

export default function EditAd() {
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
            marginTop: "50px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <AdForm ad={ad} />
          <Box
            sx={{
              width: "40%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2>Votre annonce actuelle</h2>
            <AdCard key={ad.id} ad={ad} />
          </Box>
        </Box>
      )}
    </LayoutFull>
  );
}
