import React from "react";
import CategoryWithAdsPage from "@/components/categories/CategoryWithAdsPage";
import LayoutFull from "@/components/layout/LayoutFull";
import { queryCatByIdWithAds } from "@/graphql/Categories";
import { CategoryTypes } from "@/types/CategoryTypes";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const CategoryPage = (): React.ReactNode => {
  const router = useRouter();
  const catId = router.query.id;

  const { data } = useQuery<{ item: CategoryTypes }>(queryCatByIdWithAds, {
    variables: {
      adByIdId: catId,
    },
    skip: catId === undefined,
  });
  const category = data ? data.item : null;
  return (
    <LayoutFull title={`TGC : ${category ? category.name : "Loading..."}`}>
      {category && <CategoryWithAdsPage category={category} />}
    </LayoutFull>
  );
};

export default CategoryPage;
