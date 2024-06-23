import LayoutFull from "@/components/layout/LayoutFull";
import { useRouter } from "next/router";
import { AdTypes } from "@/types/AdTypes";
import { queryAdById } from "@/graphql/ads/queryAdById";
import { useQuery } from "@apollo/client";
import IconBreadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import LoadingApp from "@/styles/LoadingApp";
import AdPage from "@/components/ads/AdPage";

function AdDetailComponent(): React.ReactNode {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useQuery<{ item: AdTypes }>(queryAdById, {
    variables: { adByIdId: id },
    skip: id === undefined,
  });

  const ad = data ? data.item : null;
  return (
    <>
      {ad ? (
        <LayoutFull title={`TGG : ${ad.title}`}>
          <IconBreadcrumbs
            items={[
              {
                url: `/categories/${ad.category.parentCategory.parentCategory.id}`,
                text: `${ad.category.parentCategory.parentCategory.name.toUpperCase()}`,
              },
              {
                url: `/categories/${ad.category.parentCategory.id}`,
                text: `${ad.category.parentCategory.name.toUpperCase()}`,
              },
              {
                url: `/categories/${ad.category.id}`,
                text: `${ad.category.name.toUpperCase()}`,
              },
              { url: "/final-item", text: `${ad.title.toUpperCase()}` },
            ]}
          />
          <AdPage ad={ad} />
        </LayoutFull>
      ) : (
        <LoadingApp />
      )}
    </>
  );
}

export default AdDetailComponent;
