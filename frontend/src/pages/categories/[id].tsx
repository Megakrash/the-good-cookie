import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { API_URL } from "@/configApi";
import axios from "axios";
import SubCategoriesCard from "@/components/subCategories/SubCategoriesCard";
import { SubCategoriesTypes, CategoriesTypes } from "@/types";

const CategoryComponent = (): React.ReactNode => {
  const router = useRouter();

  const [category, setCategory] = useState<CategoriesTypes>();
  const [subCategories, setSubCategories] = useState<SubCategoriesTypes[]>([]);

  const getCategory = () => {
    axios
      .get<CategoriesTypes>(`${API_URL}/category/${router.query.id}`)
      .then((res) => {
        setCategory(res.data);
      })

      .catch(() => {
        console.error("error");
      });
  };

  const getSubCategoriesFromCategory = () => {
    axios
      .get<SubCategoriesTypes[]>(
        `${API_URL}/subCategory?category=${router.query.id}`
      )
      .then((res) => {
        setSubCategories(res.data);
      })
      .catch(() => {
        console.error("error");
      });
  };

  useEffect(() => {
    getCategory();
    getSubCategoriesFromCategory();
  }, [router]);

  return (
    <>
      {category && (
        <Layout title={`TGG : ${category.name}`}>
          {subCategories.length >= 1 ? (
            <div>
              {subCategories.map((infos) => (
                <SubCategoriesCard
                  key={infos.id}
                  id={infos.id}
                  name={infos.name}
                  picture={infos.picture}
                  category={infos.category}
                />
              ))}
            </div>
          ) : (
            <p>{`Aucune offre dans la catégorie ${category.name} pour le moment !`}</p>
          )}
        </Layout>
      )}
    </>
  );
};

export default CategoryComponent;
