import React from "react";
import { AdTypes } from "@/types/AdTypes";
import { Box, Typography } from "@mui/material";

import AdCard from "@/components/ads/AdCard";

type SearchResultProps = {
  searchResult: AdTypes[] | number;
};

const SearchResult: React.FC<SearchResultProps> = ({ searchResult }) => {
  return (
    <Box sx={{ padding: 2, margin: "auto" }}>
      {typeof searchResult === "number" && searchResult === 1 && (
        <Typography variant="h5">Aucun résultat</Typography>
      )}
      {Array.isArray(searchResult) && (
        <Typography variant="h5">
          {searchResult.length === 1
            ? `1 annonce trouvée`
            : `${searchResult.length} annonce(s) trouvées`}
        </Typography>
      )}
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
        {Array.isArray(searchResult) &&
          searchResult.map((ad) => <AdCard key={ad.id} ad={ad} />)}
      </Box>
    </Box>
  );
};

export default SearchResult;
