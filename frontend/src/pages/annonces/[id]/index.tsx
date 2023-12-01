import LayoutFull from "@/components/LayoutFull";
import { useRouter } from "next/router";
import { AdTypes } from "@/types/types";
import AdCard from "@/components/ads/AdCard";
import { queryAdById } from "@/components/graphql/Ads";
import { useQuery } from "@apollo/client";

const AdDetailComponent = (): React.ReactNode => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, loading } = useQuery<{ item: AdTypes }>(queryAdById, {
    variables: { adByIdId: id },
    skip: id === undefined,
  });

  const ad = data ? data.item : null;
  return (
    <>
      {ad && (
        <LayoutFull title={`TGG : ${ad.title}`}>
          <AdCard key={ad.id} ad={ad} />
        </LayoutFull>
      )}
    </>
  );
};

export default AdDetailComponent;
