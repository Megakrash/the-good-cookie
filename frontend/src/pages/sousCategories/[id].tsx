import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { API_URL } from "@/configApi";
import axios from "axios";
import AdCard from "@/components/ads/AdCard";
import { SubCategoriesTypes, AdsTypes } from "@/types";
import Link from "next/link";

const SubCategoryComponent = (): React.ReactNode => {
  const router = useRouter();

  const [subCategory, setSubCategory] = useState<SubCategoriesTypes>();
  const [adsSubCategory, setAdsSubCategory] = useState<AdsTypes[]>([]);

  const getSubCategory = () => {
    axios
      .get<SubCategoriesTypes>(`${API_URL}/subCategory/${router.query.id}`)
      .then((res) => {
        setSubCategory(res.data);
      })
      .catch(() => {
        console.error("error");
      });
  };

  const getAdsFromSubCategory = () => {
    axios
      .get<AdsTypes[]>(`${API_URL}/annonce?subCategory=${router.query.id}`)
      .then((res) => {
        setAdsSubCategory(res.data);
      })
      .catch(() => {
        console.error("error");
      });
  };

  useEffect(() => {
    getSubCategory();
    getAdsFromSubCategory();
  }, [router]);

  return (
    <>
      {subCategory && (
        <Layout title={`TGG : ${subCategory.name}`}>
          <div>
            <Link href={`/categories/${subCategory.category.id}`}>
              <p>{subCategory.category.name.toUpperCase()}</p>
            </Link>
            <Link href={`/sousCategories/${subCategory.id}`}>
              <p>{subCategory.name.toUpperCase()}</p>
            </Link>
          </div>

          <p>{`Toutes les offres de la catégorie ${subCategory.name}`}</p>
          {adsSubCategory.length >= 1 ? (
            <div>
              {adsSubCategory.map((infos) => (
                <AdCard
                  key={infos.id}
                  id={infos.id}
                  title={infos.title}
                  description={infos.description}
                  price={infos.price}
                  createdDate={infos.createdDate}
                  updateDate={infos.updateDate}
                  picture={infos.picture}
                  location={infos.location}
                  subCategory={infos.subCategory}
                  user={infos.user}
                  tags={infos.tags}
                  onReRender={getAdsFromSubCategory}
                />
              ))}
            </div>
          ) : (
            <p>{`Aucune offre dans la catégorie ${subCategory.name} pour le moment !`}</p>
          )}
        </Layout>
      )}
    </>
  );
};

export default SubCategoryComponent;
