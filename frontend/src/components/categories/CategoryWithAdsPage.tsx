import React from "react";
import { CategoryTypes } from "@/types/CategoryTypes";
import { useQuery } from "@apollo/client";
import { AdTypes } from "@/types/AdTypes";
import { queryAllAds } from "@/graphql/ads/queryAllAds";
import { Box, Typography } from "@mui/material";
import AdCard from "../ads/AdCard";

type CategoryWithAdsPageProps = {
  category: CategoryTypes;
};

const CategoryWithAdsPage: React.FC<CategoryWithAdsPageProps> = ({
  category,
}) => {
  const { data } = useQuery<{ items: AdTypes[] }>(queryAllAds, {
    variables: {
      where: {
        category: category.id,
      },
    },
  });
  const ads = data ? data.items : null;

  return (
    <Box sx={{ padding: 2, margin: "auto" }}>
      <Typography variant="h5">Les dernières annonces</Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginTop: 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {ads && ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
      </Box>
    </Box>
  );
};

export default CategoryWithAdsPage;
