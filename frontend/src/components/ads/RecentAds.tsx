import React from "react";
import AdCard from "./AdCard";
import { AdsTypes } from "@/types/types";
import { queryAllAds } from "../graphql/Ads";
import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

const RecentAds = (): React.ReactNode => {
  const { data } = useQuery<{ items: AdsTypes }>(queryAllAds);
  const ads = data ? data.items : [];
  function groupAdsByCategory(
    ads: AdsTypes
  ): Record<number, { category: { id: number; name: string }; ads: AdsTypes }> {
    return ads.reduce((acc, ad) => {
      const { id, name } = ad.subCategory.category;
      if (!acc[id]) {
        acc[id] = { category: { id, name }, ads: [] };
      }
      acc[id].ads.push(ad);
      return acc;
    }, {} as Record<number, { category: { id: number; name: string }; ads: AdsTypes }>);
  }

  const groupedAds = groupAdsByCategory(ads);

  return (
    <Box
      sx={{
        width: "90%",
        margin: "auto",
      }}
    >
      <Typography
        sx={{
          marginBottom: "15px",
          width: "auto",
        }}
        variant="h4"
      >
        Annonces récentes
      </Typography>
      {Object.entries(groupedAds).map(([categoryId, group]) => (
        <Box sx={{ marginBottom: "20px" }} key={categoryId}>
          <Typography variant="h5" sx={{ marginBottom: "15px" }}>
            <Link href={`/categories/${categoryId}`}>
              Catégorie : {group.category.name}
            </Link>
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              margin: "auto",
            }}
          >
            {group.ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RecentAds;
