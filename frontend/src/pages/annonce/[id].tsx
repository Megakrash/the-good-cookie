import { useEffect, useState } from "react";
import { AdCardProps } from "@/components/AdCard";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { API_URL } from "@/configApi";
import axios from "axios";

const AdDetailComponent = (): React.ReactNode => {
  const router = useRouter();

  const [Ad, setAd] = useState([] as AdCardProps[]);

  const getAd = () => {
    axios
      .get(`${API_URL}/annonces/${router.query.id}`)
      .then((res) => {
        setAd(res.data);
      })
      .catch((err) => {
        console.error("error", err);
      });
  };

  useEffect(() => {
    getAd();
  }, []);

  return (
    <>
      {Ad && (
        <Layout title={`TGG : ${Ad.title}`}>
          <p>{`Le détail de l'offre ${Ad.title}`}</p>
          <p>{Ad.price} €</p>
          <img src={Ad.picture} alt={Ad.title} />
        </Layout>
      )}
    </>
  );
};

export default AdDetailComponent;
