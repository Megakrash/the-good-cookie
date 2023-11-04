import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import SubCategoriesCard from "@/components/subCategories/SubCategoriesCard";
import { CategoryTypes } from "@/types";
import { useQuery } from "@apollo/client";
import { queryCatByIdAndSub } from "@/components/graphql/Categories";

const CategoryComponent = (): React.ReactNode => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, loading } = useQuery<{ item: CategoryTypes }>(
    queryCatByIdAndSub,
    {
      variables: { categoryByIdId: id },
      skip: id === undefined,
    }
  );

  const category = data ? data.item : null;

  return (
    <>
      {category && (
        <Layout title={`TGG : ${category.name}`}>
          <div>
            {category.subCategories.length >= 1 ? (
              <>
                {category.subCategories.map((subCat) => (
                  <SubCategoriesCard
                    key={subCat.id}
                    id={subCat.id}
                    name={subCat.name}
                    picture={subCat.picture}
                  />
                ))}
              </>
            ) : (
              <p>{`Aucune offre dans la catégorie ${category.name} pour le moment !`}</p>
            )}
          </div>
        </Layout>
      )}
    </>
  );
};

export default CategoryComponent;
