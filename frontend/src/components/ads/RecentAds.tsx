import { useEffect, useState } from "react";
import AdCard from "./AdCard";
import { API_URL } from "@/configApi";
import axios from "axios";
import { AdsTypes } from "@/types";

export default function RecentAds(): React.ReactNode {
  const [allAds, setAllAds] = useState<AdsTypes[]>([]);

  const getAllAds = () => {
    axios
      .get(`${API_URL}/annonces`)
      .then((res) => {
        setAllAds(res.data);
      })
      .catch(() => {
        console.error("error");
      });
  };

  useEffect(() => {
    getAllAds();
  }, []);

  return (
    <div>
      <h2>Annonces récentes</h2>
      <section className="recent-ads">
        {allAds.map((infos) => (
          <AdCard
            key={infos.id}
            id={infos.id}
            title={infos.title}
            description={infos.description}
            owner={infos.owner}
            price={infos.price}
            createdDate={infos.createdDate}
            picture={infos.picture}
            location={infos.location}
            category={infos.category}
            tags={infos.tags}
            onReRender={getAllAds}
          />
        ))}
      </section>
    </div>
  );
}
