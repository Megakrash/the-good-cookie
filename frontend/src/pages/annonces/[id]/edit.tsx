import { AdTypes } from "@/types";
import AdCreate from "@/components/ads/AdCreate";
import Layout from "@/components/Layout";
import { queryAdById } from "@/components/graphql/Ads";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

export default function EditAd() {
  const router = useRouter();
  const adId = router.query.id;

  const { data } = useQuery<{ item: AdTypes }>(queryAdById, {
    variables: {
      id: adId,
    },
    skip: adId === undefined,
  });
  const ad = data ? data.item : null;

  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">{ad && <AdCreate ad={ad} />}</main>
    </Layout>
  );
}
