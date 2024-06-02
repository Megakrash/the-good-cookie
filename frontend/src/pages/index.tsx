import LayoutFull from "@/components/layout/LayoutFull";
import Search from "@/components/search/Search";

function Home(): React.ReactNode {
  return (
    <LayoutFull title="Accueil TGC">
      <Search />
    </LayoutFull>
  );
}

export default Home;
