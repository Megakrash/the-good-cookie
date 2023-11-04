import Layout from "@/components/Layout";
import AdCreate from "@/components/ads/AdCreate";

const NewAd = (): React.ReactNode => {
  return (
    <>
      <Layout title="TGD : Créer mon annonce">
        <AdCreate />
      </Layout>
    </>
  );
};

export default NewAd;
