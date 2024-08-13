import { queryAllRootCategoriesWithAdCount } from "@/graphql/categories/queryAllRootCategoriesWithAdCount";
import { CategoryTypes } from "@/types/CategoryTypes";
import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import React from "react";
import UniversCard from "./UniversCard";

const Univers = (): React.ReactNode => {
  const { data } = useQuery<{ items: CategoryTypes[] }>(
    queryAllRootCategoriesWithAdCount,
  );
  const category = data ? data.items : null;
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: 3,
          marginBottom: 4,
          gap: 1,
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Nos univers, pour toutes les étapes de votre vie en Cookies !
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
          Des annonces gratuites entre particuliers et professionnels, pour
          acheter, vendre, échanger ... Découvrez nos rubriques !
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {category &&
          category.map((category) => (
            <UniversCard key={category.id} category={category} />
          ))}
      </Box>
    </Box>
  );
};

export default Univers;
