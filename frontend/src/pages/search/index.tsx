import Search from "@/components/search/Search";
import LayoutFull from "@/components/layout/LayoutFull";
import { useState } from "react";
import { AdTypes } from "@/types/AdTypes";
import SearchResult from "@/components/search/components/SearchResult";

function SearchPage(): React.ReactNode {
  const [searchResult, setSearchResult] = useState<AdTypes[] | number>(0);
  return (
    <LayoutFull title="TGC : Contact">
      <Search setSearchResult={setSearchResult} />
      {searchResult !== 0 && <SearchResult searchResult={searchResult} />}
    </LayoutFull>
  );
}

export default SearchPage;
