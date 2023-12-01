import LayoutFull from "@/components/LayoutFull";
import RecentAds from "@/components/ads/RecentAds";
import Search from "@/components/search/Search";

const Home = (): React.ReactNode => {
  return (
    <LayoutFull title="Accueil TGC">
      <Search />
      <RecentAds />
    </LayoutFull>
  );
};

export default Home;
