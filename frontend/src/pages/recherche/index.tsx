import Search from "@/components/search/Search";
import LayoutFull from "@/components/layout/LayoutFull";

const SearchPage = (): React.ReactNode => {
  return (
    <>
      <LayoutFull title="TGC : Contact">
        <Search />
      </LayoutFull>
    </>
  );
};

export default SearchPage;
