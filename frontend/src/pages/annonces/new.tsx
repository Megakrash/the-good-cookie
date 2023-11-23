import Layout from "@/components/Layout";
import AdForm from "@/components/ads/adForm/AdForm";

const NewAd = (): React.ReactNode => {
  return (
    <Layout title="TGD : Créer mon annonce">
      <AdForm />
    </Layout>
  );
};

export default NewAd;
