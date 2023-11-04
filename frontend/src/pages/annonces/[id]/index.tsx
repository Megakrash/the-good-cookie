import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { AdTypes } from "@/types";
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
        <Layout title={`TGG : ${ad.title}`}>
          <AdCard
            key={ad.id}
            id={ad.id}
            title={ad.title}
            description={ad.description}
            price={ad.price}
            createdDate={ad.createdDate}
            updateDate={ad.updateDate}
            picture={ad.picture}
            location={ad.location}
            subCategory={ad.subCategory}
            user={ad.user}
            tags={ad.tags}
          />
        </Layout>
      )}
    </>
  );
};

export default AdDetailComponent;
