import LayoutFull from "@/components/LayoutFull";
import { useRouter } from "next/router";
import AdCard from "@/components/ads/AdCard";
import { SubCategoryTypes } from "@/types";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { querySubCatAndAds } from "@/components/graphql/SubCategories";

const SubCategoryComponent = (): React.ReactNode => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, loading } = useQuery<{ item: SubCategoryTypes }>(
    querySubCatAndAds,
    {
      variables: { subCategoryByIdId: id },
      skip: id === undefined,
    }
  );

  const subCategory = data ? data.item : null;

  return (
    <>
      {subCategory && subCategory.category && (
        <LayoutFull title={`TGG : ${subCategory.name}`}>
          <div>
            <Link href={`/categories/${subCategory.category.id}`}>
              <p>{subCategory.category.name.toUpperCase()}</p>
            </Link>
            <Link href={`/sousCategories/${subCategory.id}`}>
              <p>{subCategory.name.toUpperCase()}</p>
            </Link>
          </div>

          <p>{`Toutes les offres de la catégorie ${subCategory.name}`}</p>
          {Array.isArray(subCategory.ads) && subCategory.ads.length > 0 ? (
            <div>
              {subCategory.ads.map((infos) => (
                <AdCard key={infos.id} ad={infos} />
              ))}
            </div>
          ) : (
            <p>{`Aucune offre dans la catégorie ${subCategory.name} pour le moment !`}</p>
          )}
        </LayoutFull>
      )}
    </>
  );
};

export default SubCategoryComponent;
