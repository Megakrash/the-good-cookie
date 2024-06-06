import React from "react";
import CategoryWithAdsPage from "@/components/categories/CategoryWithAdsPage";
import LayoutFull from "@/components/layout/LayoutFull";
import { queryCatByIdWithParents } from "@/graphql/Categories";
import { CategoryTypes } from "@/types/CategoryTypes";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import LoadingApp from "@/styles/LoadingApp";
import IconBreadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import CategoryWithNoAdsPage from "@/components/categories/CategoryWithNoAdsPage";

const CategoryPage = (): React.ReactNode => {
  const router = useRouter();
  const catId = router.query.id;

  const { data } = useQuery<{ item: CategoryTypes }>(queryCatByIdWithParents, {
    variables: {
      categoryByIdId: catId,
    },
    skip: catId === undefined,
  });
  const category = data ? data.item : null;
  return (
    <>
      {category ? (
        <LayoutFull
          title={`TGC : ${category ? `${category.parentCategory?.name}-${category.name}` : "Loading..."}`}
        >
          {/* If category has no child categories, display the category with ads */}
          {category.parentCategory && category.childCategories.length < 1 && (
            <>
              <IconBreadcrumbs
                items={[
                  {
                    url: `/categories/${category.parentCategory.parentCategory.id}`,
                    text: `${category.parentCategory.parentCategory.name.toUpperCase()}`,
                  },
                  {
                    url: `/categories/${category.parentCategory.id}`,
                    text: `${category.parentCategory.name.toUpperCase()}`,
                  },
                  {
                    url: "/final-item",
                    text: `${category.name.toUpperCase()}`,
                  },
                ]}
              />
              <CategoryWithAdsPage category={category} />
            </>
          )}
          {/* If category has child categories & parentCategory, display the category with child categories */}
          {category.childCategories.length >= 1 && category.parentCategory && (
            <>
              <IconBreadcrumbs
                items={[
                  {
                    url: `/categories/${category.parentCategory.id}`,
                    text: `${category.parentCategory.name.toUpperCase()}`,
                  },
                  {
                    url: "/final-item",
                    text: `${category.name.toUpperCase()}`,
                  },
                ]}
              />
              <CategoryWithNoAdsPage category={category} />
            </>
          )}
          {/* If category his root, display the category with child categories */}
          {category.parentCategory === null && (
            <>
              <IconBreadcrumbs
                items={[
                  {
                    url: "/final-item",
                    text: `${category.name.toUpperCase()}`,
                  },
                ]}
              />
              <CategoryWithNoAdsPage category={category} />
            </>
          )}
        </LayoutFull>
      ) : (
        <LoadingApp />
      )}
    </>
  );
};

export default CategoryPage;
