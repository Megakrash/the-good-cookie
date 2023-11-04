import { AdTypes } from "@/types";
import AdCreate from "@/components/ads/AdCreate";
import AdCard from "@/components/ads/AdCard";
import Layout from "@/components/Layout";
import { queryAdById } from "@/components/graphql/Ads";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

export default function EditAd() {
  const router = useRouter();
  const adId = router.query.id;

  const { data } = useQuery<{ item: AdTypes }>(queryAdById, {
    variables: {
      adByIdId: adId,
    },
    skip: adId === undefined,
  });
  const ad = data ? data.item : null;

  return (
    <Layout title="Modifier mon annonce">
      {ad && (
        <>
          <AdCreate ad={ad} />
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
        </>
      )}
    </Layout>
  );
}
