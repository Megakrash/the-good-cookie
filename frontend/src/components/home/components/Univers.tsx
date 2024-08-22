import { queryAllRootCategoriesWithAdCount } from "@/graphql/categories/queryAllRootCategoriesWithAdCount";
import { CategoryTypes } from "@/types/CategoryTypes";
import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import React from "react";
import Carousel from "./Carousel";

const Univers = (): React.ReactNode => {
  const { data } = useQuery<{ items: CategoryTypes[] }>(
    queryAllRootCategoriesWithAdCount,
  );
  const categories = data ? data.items : null;
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
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
      <div
        className="carousel-box"
        // sx={{
        //   // display: "flex",
        //   // width: "90%",
        //   // flexWrap: "wrap",
        //   // gap: 10,
        //   // justifyContent: "center",
        //   // alignItems: "center",
        // }}
      >
        {categories && <Carousel categories={categories} />}
      </div>
    </Box>
  );
};

export default Univers;
