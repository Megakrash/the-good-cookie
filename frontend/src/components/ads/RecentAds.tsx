import AdCard from "./AdCard";
import { AdsTypes } from "@/types";
import { queryAllAds } from "../graphql/Ads";
import { useQuery } from "@apollo/client";

export default function RecentAds(): React.ReactNode {
  const { data } = useQuery<{ items: AdsTypes }>(queryAllAds);
  const ads = data ? data.items : [];

  return (
    <div>
      <h2>Annonces récentes</h2>
      <section className="recent-ads">
        {ads.map((ad) => (
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
        ))}
      </section>
    </div>
  );
}
