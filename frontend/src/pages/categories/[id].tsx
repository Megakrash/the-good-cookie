import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { API_URL } from "@/configApi";
import axios from "axios";
import AdCard from "@/components/ads/AdCard";
import { AdsTypes, CategoriesTypes } from "@/types";

const CategoryComponent = (): React.ReactNode => {
  const router = useRouter();

  const [category, setCategory] = useState<CategoriesTypes>();
  const [adsCategory, setAdsCategory] = useState<AdsTypes[]>([]);

  const getCategory = () => {
    axios
      .get(`${API_URL}/category/${router.query.id}`)
      .then((res) => {
        setCategory(res.data);
      })

      .catch(() => {
        console.error("error");
      });
  };

  const getAdsFromCategory = () => {
    axios
      .get(`${API_URL}/annonces?category=${router.query.id}`)
      .then((res) => {
        setAdsCategory(res.data);
      })

      .catch(() => {
        setAdsCategory([]);
        console.error("error");
      });
  };

  useEffect(() => {
    getCategory();
    getAdsFromCategory();
  }, [router]);

  return (
    <>
      {category && (
        <Layout title={`TGG : ${category.name}`}>
          <p>{`Toutes les offres de la catégorie ${category.name}`}</p>
          {adsCategory.length >= 1 ? (
            <div>
              {adsCategory.map((infos) => (
                <AdCard
                  key={infos.id}
                  id={infos.id}
                  title={infos.title}
                  description={infos.description}
                  owner={infos.owner}
                  price={infos.price}
                  createdDate={infos.createdDate}
                  picture={infos.picture}
                  location={infos.location}
                  category={infos.category}
                  tags={infos.tags}
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
