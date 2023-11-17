import Layout from "@/components/Layout";
import RecentAds from "@/components/ads/RecentAds";
import Search from "@/components/search/Search";

const Home = (): React.ReactNode => {
  return (
    <Layout title="Accueil TGC">
      <Search />
      <RecentAds />
    </Layout>
  );
};

export default Home;
