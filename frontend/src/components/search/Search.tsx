import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/configApi";
import { CategoriesTypes, SearchAds } from "@/types";

const Search = (): React.ReactNode => {
  //Get all categories
  const [categories, setCategories] = useState<CategoriesTypes[]>([]);

  const getAllCategories = () => {
    axios
      .get(`${API_URL}/category`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch(() => {
        console.error("error");
      });
  };

  useEffect(() => {
    getAllCategories();
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
  // Search result
  const [seachResult, setSeachResult] = useState<SearchAds>([]);
  const searchAds = () => {
    axios
      .get<SearchAds>(
        `${API_URL}/annonce?subCategory=${selectedCategory}&location=${selectedLocation}`
      )
      .then((res) => {
        setSeachResult(res.data);
      })
      .catch((err) => {
        if (err.status === "404") {
        }
        console.error(err.status);
      });
  };
  return (
    <div>
      <select value={selectedCategory} onChange={handleChangeCategory}>
        <option value="" hidden>
          Sélectionnez une catégorie
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
      <button onClick={searchAds}>Rechercher</button>
    </div>
  );
};

export default Search;
