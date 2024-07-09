import React from "react";
import { useQuery } from "@apollo/client";
import { CategoriesTypes } from "@/types/CategoryTypes";
import CategoryDataGrid from "./CategoriesDataGrid";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import router from "next/router";
import LoadingApp from "@/styles/LoadingApp";
import { queryAllCategories } from "@/graphql/categories/queryAllCategories";

const BackOfficeCategoriesList = (): React.ReactNode => {
  const { data, loading } = useQuery<{ items: CategoriesTypes }>(
    queryAllCategories,
  );
  if (loading) return <LoadingApp />;
  const categories = data?.items || [];
  return (
    <Box sx={{ marginTop: "30px" }}>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => {
          router.push(`/tgc-backoffice/categories/new`);
        }}
      >
        Ajouter une catégorie
      </Button>
      {categories && <CategoryDataGrid categories={categories} />}
    </Box>
  );
};

export default BackOfficeCategoriesList;
