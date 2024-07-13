import LayoutFull from "@/components/layout/LayoutFull";
import HomePage from "@/components/home/HomePage";

function Home(): React.ReactNode {
  return (
    <LayoutFull title="Accueil TGC">
      <HomePage />
    </LayoutFull>
  );
}

export default Home;
