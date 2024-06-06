import React from "react";
import { CategoryTypes } from "@/types/CategoryTypes";
import { Box } from "@mui/material";
import CategoryCard from "./CategoryCard";

type CategoryWithAdsPageProps = {
  category: CategoryTypes;
};

const CategoryWithNoAdsPage: React.FC<CategoryWithAdsPageProps> = ({
  category,
}) => {
  return (
    <Box sx={{ width: "95%", margin: "auto", marginTop: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {category.childCategories.map((childCategory) => (
          <CategoryCard key={childCategory.id} category={childCategory} />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryWithNoAdsPage;
