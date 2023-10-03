import { useEffect, useState } from "react";
import axios from "axios";
import { getAllCategories } from "../apiRest/ApiCategories";
import { API_URL } from "@/configApi";
import { CategoriesTypes, SearchAds } from "@/types";
import { FaSliders } from "react-icons/fa6";

const Search = (): React.ReactNode => {
  const [showQueries, setShowQueries] = useState<boolean>(false);

  //Get categories
  const [categories, setCategories] = useState<CategoriesTypes>([]);

  useEffect(() => {
    getAllCategories(setCategories);
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
    return url;
  };

  // Search result
  const [seachResult, setSeachResult] = useState<SearchAds>([]);
  // Search request
  const searchAds = () => {
    const url = buildSearchURL();
    axios
      .get<SearchAds>(url)
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
        <p>Filtres</p>
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
        </>
      )}
      {showQueries && (
        <button type="button" onClick={searchAds}>
          Rechercher
        </button>
      )}
    </div>
  );
};

export default Search;
