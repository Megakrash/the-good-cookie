import { useEffect, useState } from "react";
import axios from "axios";
import { getAllCategories } from "../apiRest/ApiCategories";
import { getAllTags } from "../apiRest/ApiTags";
import { API_URL } from "@/configApi";
import { CategoriesTypes, AdsTypes, TagsTypes } from "@/types";
import { FaSliders } from "react-icons/fa6";

const Search = (): React.ReactNode => {
  const [showQueries, setShowQueries] = useState<boolean>(false);

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
  // Categories
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") return;
    setSelectedCategory(value);
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
    let url = `${API_URL}/annonce?subCategory=${selectedCategory}&location=${selectedLocation}`;

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
        console.log(res.data);
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
          <select value={selectedCategory} onChange={handleChangeCategory}>
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
            placeholder="Où ?*"
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
    </div>
  );
};

export default Search;
