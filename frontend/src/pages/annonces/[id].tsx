import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { API_URL } from "@/configApi";
import axios from "axios";
import { AdTypes } from "@/types";
import Image from "next/image";

const AdDetailComponent = (): React.ReactNode => {
  const router = useRouter();
  const adId = router.query.id as string;

  const [Ad, setAd] = useState<AdTypes>();

  const getAd = () => {
    axios
      .get<AdTypes>(`${API_URL}/annonce/${adId}`)
      .then((res) => {
        setAd(res.data);
      })
      .catch((err) => {
        console.error("error", err);
      });
  };

  useEffect(() => {
    getAd();
  }, [adId]);

  return (
    <>
      {Ad && (
        <Layout title={`TGG : ${Ad.title}`}>
          <p>{`Le détail de l'offre ${Ad.title}`}</p>
          <p>{Ad.price} €</p>
          <Image src={Ad.picture} alt={Ad.title} width="200" height="200" />
        </Layout>
      )}
    </>
  );
};

export default AdDetailComponent;
