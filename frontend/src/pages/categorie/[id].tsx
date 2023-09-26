import { useEffect, useState } from "react";
import { NavCategoriesProps } from "@/components/NavCategories";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { API_URL } from "@/configApi";
import axios from "axios";

const CategoryComponent = (): React.ReactNode => {
  const router = useRouter();

  const [category, setCategory] = useState([] as NavCategoriesProps[]);

  const getCat = () => {
    axios
      .get(`${API_URL}/category/${router.query.id}`)
      .then((res) => {
        setCategory(res.data);
      })
      .catch(() => {
        console.error("error");
      });
  };

  useEffect(() => {
    getCat();
  }, [router]);

  return (
    <>
      {category && (
        <Layout title={`TGG : ${category.name}`}>
          <p>{`Toutes les offres de la catégorie ${category.name}`}</p>
        </Layout>
      )}
    </>
  );
};

export default CategoryComponent;
