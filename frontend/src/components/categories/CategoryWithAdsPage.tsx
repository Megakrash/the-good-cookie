import React from "react";
import { CategoryTypes } from "@/types/CategoryTypes";

type CategoryWithAdsPageProps = {
  category: CategoryTypes;
};

const CategoryWithAdsPage: React.FC<CategoryWithAdsPageProps> = ({
  category,
}) => {
  return <div>CategoryWithAdsPage: {category.name}</div>;
};

export default CategoryWithAdsPage;
