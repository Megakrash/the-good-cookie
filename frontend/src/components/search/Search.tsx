import { useEffect, useState } from "react";
import AdCard from "../ads/AdCard";
import axios from "axios";
import { getAllCategories } from "../apiRest/ApiCategories";
import { getAllTags } from "../apiRest/ApiTags";
import { API_URL } from "@/configApi";
import { CategoriesTypes, AdsTypes, TagsTypes } from "@/types";
import { FaSliders } from "react-icons/fa6";

const Search = (): React.ReactNode => {
  const [showQueries, setShowQueries] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  //Get categories & Tags
  const [categories, setCategories] = useState<CategoriesTypes>([]);
  const [tags, setTags] = useState<TagsTypes>([]);

  useEffect(() => {
    getAllCategories(setCategories);
    getAllTags(setTags);
  }, []);
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
  const [selectedTag, setSelectedTag] = useState<string>();
  const handleChangeTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") return;
    setSelectedTag(value);
  };
  // Location
  const [selectedLocation, setSelectedLocation] = useState<string>();
  // Min Price
  const [minPrice, setMinPrice] = useState<string>();
  // Max Price
  const [maxPrice, setMaxPrice] = useState<string>();
  // Title
  const [title, setTitle] = useState<string>();

  //-----------------
  // Search URL
  //-----------------

  const buildSearchURL = (): string => {
    let url = `${API_URL}/annonce?subCategory=${selectedSubCategory}`;
    if (selectedLocation) {
      url += `&location=${selectedLocation}`;
    }
    if (minPrice) {
      url += `&minPrice=${minPrice}`;
    }
    if (maxPrice) {
      url += `&maxPrice=${maxPrice}`;
    }
    if (title) {
      url += `&title=${encodeURIComponent(title)}`;
    }
    if (selectedTag) {
      url += `&tags=${selectedTag}`;
    }
    return url;
  };

  // Search result
  const [seachResult, setSeachResult] = useState<AdsTypes>([]);
  // Search request
  const searchAds = () => {
    const url = buildSearchURL();
    axios
      .get<AdsTypes>(url)
      .then((res) => {
        setSeachResult(res.data);
        setShowResult(true);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
        } else {
          console.error(err);
        }
      });
  };
  return (
    <div>
      {categories && tags && (
        <>
          <select value={selectedSubCategory} onChange={handleChangeCategory}>
            <option value="" hidden>
              Sélectionnez une catégorie*
            </option>
            {categories.map((category) => (
              <optgroup key={category.id} label={category.name}>
                {category.subCategory.map((sub) => (
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
            <button type="button" onClick={searchAds}>
              Rechercher
            </button>
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
                type="text"
                name="MinPrice"
                placeholder="Prix minimum €"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="text"
                name="MaxPrice"
                placeholder="Prix maximum €"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <select value={selectedTag} onChange={handleChangeTag}>
                <option value="" hidden>
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
            <button type="button" onClick={searchAds}>
              Rechercher
            </button>
          )}
        </>
      )}
      {showResult && seachResult.length >= 1 && (
        <>
          <h2>
            {seachResult.length} annonces correspondent à votre recherche :
          </h2>
          <section className="recent-ads">
            {seachResult.map((infos) => (
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
                onReRender={searchAds}
              />
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default Search;
