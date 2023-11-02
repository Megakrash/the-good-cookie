import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { PATH_IMAGE } from "@/configApi";
import { AdTypes } from "@/types";
import Image from "next/image";
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

  const picturePath: string = `${PATH_IMAGE}ads/`;

  return (
    <>
      {ad && (
        <Layout title={`TGG : ${ad.title}`}>
          <p>{`Le détail de l'offre ${ad.title}`}</p>
          <p>{ad.price} €</p>
          <Image
            src={picturePath + ad.picture}
            alt={ad.title}
            width="200"
            height="200"
          />
        </Layout>
      )}
    </>
  );
};

export default AdDetailComponent;
