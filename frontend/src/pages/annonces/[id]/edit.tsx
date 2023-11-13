import { AdTypes } from "@/types";
import AdForm from "@/components/ads/AdForm";
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
          <AdForm ad={ad} />
          <AdCard key={ad.id} ad={ad} />
        </>
      )}
    </Layout>
  );
}
