import LayoutFull from "@/components/layout/LayoutFull";
import AdForm from "@/components/ads/adForm/AdForm";

const NewAd = (): React.ReactNode => {
  return (
    <LayoutFull title="TGD : Créer mon annonce">
      <AdForm />
    </LayoutFull>
  );
};

export default NewAd;
