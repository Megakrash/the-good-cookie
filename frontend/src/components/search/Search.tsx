import { FormEvent, useState } from "react";
import AdCard from "../ads/AdCard";
import { CategoriesTypes, AdsTypes, TagsTypes } from "@/types";
import { FaSliders } from "react-icons/fa6";
import { queryAllCatAndSub } from "../graphql/Categories";
import { queryAllAds } from "../graphql/Ads";
import { queryAllTags } from "../graphql/Tags";
import { useLazyQuery, useQuery } from "@apollo/client";

const Search = (): React.ReactNode => {
  // Get Categories&SubCategories & Tags
  const {
    data: dataCategories,
    error: errorCategories,
    loading: loadindCategories,
  } = useQuery<{ items: CategoriesTypes }>(queryAllCatAndSub);
  const categories = dataCategories ? dataCategories.items : [];

  const {
    data: dataTags,
    error: errorTags,
    loading: loadingTags,
  } = useQuery<{ items: TagsTypes }>(queryAllTags);
  const tags = dataTags ? dataTags.items : [];
  const [showQueries, setShowQueries] = useState<boolean>(false);

  //-----------------
  // Selected queries
  //-----------------
  // subCategories
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") return;
    setSelectedSubCategory(value);
  };
  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>();
  const handleChangeTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedTags(value);
  };
  // Location
  const [selectedLocation, setSelectedLocation] = useState<string>();
  // Min Price
  const [minPrice, setMinPrice] = useState<number>();
  // Max Price
  const [maxPrice, setMaxPrice] = useState<number>();
  // Title
  const [title, setTitle] = useState<string>();

  //-----------------
  //----- Search-----
  //-----------------

  const [
    doSearch,
    { data: dataSearch, error: errorSearch, loading: loadingSearch },
  ] = useLazyQuery<{ items: AdsTypes }>(queryAllAds);
  const searchResult = dataSearch ? dataSearch.items : [];
  const handleSearchClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    doSearch({
      variables: {
        where: {
          subCategory: selectedSubCategory,
          location: selectedLocation,
          minPrice: minPrice,
          maxPrice: maxPrice,
          title: title,
          tags: selectedTags,
        },
      },
    });
  };

  //-----------------
  //--Reset form-----
  //-----------------

  // const resetForm = (): void => {
  //   setSelectedSubCategory("");
  //   setSelectedTag("");
  //   setSelectedLocation("");
  //   setMinPrice("");
  //   setMaxPrice("");
  //   setSelectedLocation("");
  // };

  return (
    <div>
      {categories && tags && (
        <form onSubmit={handleSearchClick}>
          <select value={selectedSubCategory} onChange={handleChangeCategory}>
            <option value="" hidden>
              Sélectionnez une catégorie
            </option>
            {categories.map((category) => (
              <optgroup key={category.id} label={category.name}>
                {category.subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <input
            type="text"
            name="location"
            placeholder="Où ?"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          />
          {!showQueries && (
            <>
              <button type="submit" disabled={loadingSearch}>
                Rechercher
              </button>
              {/* <button type="button" onClick={resetForm}>
                Reset
              </button> */}
            </>
          )}
          <button type="button" onClick={() => setShowQueries(!showQueries)}>
            <FaSliders />
            <p>{!showQueries ? "Plus de filtres" : "Moins de filtres"}</p>
          </button>
          {showQueries && (
            <>
              <input
                type="text"
                name="titre"
                placeholder="Quoi ?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="number"
                name="MinPrice"
                placeholder="Prix minimum €"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
              />
              <input
                type="number"
                name="MaxPrice"
                placeholder="Prix maximum €"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
              />
              <select multiple value={selectedTags} onChange={handleChangeTag}>
                <option value="" disabled>
                  Sélectionnez un Tag
                </option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </>
          )}
          {showQueries && (
            <>
              <button type="submit">Rechercher</button>
              {/* <button type="button" onClick={resetForm}>
                Reset
              </button> */}
            </>
          )}
        </form>
      )}
      {searchResult.length >= 1 && (
        <>
          <h2>
            {searchResult.length} annonces correspondent à votre recherche :
          </h2>
          <section className="recent-ads">
            {searchResult.map((infos) => (
              <AdCard
                key={infos.id}
                id={infos.id}
                title={infos.title}
                description={infos.description}
                price={infos.price}
                createdDate={infos.createdDate}
                updateDate={infos.updateDate}
                picture={infos.picture}
                location={infos.location}
                subCategory={infos.subCategory}
                user={infos.user}
                tags={infos.tags}
              />
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default Search;
