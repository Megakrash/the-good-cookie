import AdCard, { AdCardProps } from "./AdCard";

export default function RecentAds(): React.ReactNode {
  const ads: AdCardProps[] = [
    {
      id: 1,
      imgUrl: "/images/table.webp",
      link: "/ads/table",
      price: 120,
      title: "Table",
    },
    {
      id: 2,
      imgUrl: "/images/dame-jeanne.webp",
      link: "/ads/dame-jeanne",
      price: 75,
      title: "Dame-jeanne",
    },
    {
      id: 3,
      imgUrl: "/images/vide-poche.webp",
      link: "/ads/vide-poche",
      price: 4,
      title: "Vide-poche",
    },
    {
      id: 4,
      imgUrl: "/images/vaisselier.webp",
      link: "/ads/vaisselier",
      price: 900,
      title: "Vaisselier",
    },
    {
      id: 5,
      imgUrl: "/images/bougie.webp",
      link: "/ads/bougie",
      price: 8,
      title: "Bougie",
    },
    {
      id: 6,
      imgUrl: "/images/porte-magazine.webp",
      link: "/ads/porte-magazine",
      price: 45,
      title: "Porte-magazine",
    },
  ];

  return (
    <div>
      <h2>Annonces récentes</h2>
      <section className="recent-ads">
        {ads.map((infos) => (
          <AdCard
            key={infos.id}
            id={infos.id}
            imgUrl={infos.imgUrl}
            link={infos.link}
            price={infos.price}
            title={infos.title}
          />
        ))}
      </section>
    </div>
  );
}
