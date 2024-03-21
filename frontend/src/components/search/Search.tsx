import React, { FormEvent, useState } from "react";
import { CategoriesTypes } from "@/types/CategoryTypes";
import { AdsTypes } from "@/types/AdTypes";
import { TagsTypes } from "@/types/TagTypes";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Box,
  Button,
} from "@mui/material";
import { FilterAlt, FilterAltOff } from "@mui/icons-material";
import { PATH_IMAGE } from "@/api/configApi";
import { queryAllTags } from "../graphql/Tags";
import { queryAllAds } from "../graphql/Ads";
import { queryAllCatAndSub } from "../graphql/Categories";
import GpsAndRadius from "./components/GpsAndRadius";
import AdCard from "../ads/AdCard";

function Search(): React.ReactNode {
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

  //-----------------
  // Selected queries
  //-----------------
  const [showQueries, setShowQueries] = useState<boolean>(false);
  // subCategories
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
  const handleChangeCategory = (event: SelectChangeEvent) => {
    setSelectedSubCategory(event.target.value as string);
  };
  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSelectedTags(value);
  };

  // Location
  const [lat, setLat] = useState<number>();
  const [long, setLong] = useState<number>();
  const [radius, setRadius] = useState<number>(30);
  // Min Price
  const [minPrice, setMinPrice] = useState<number>();
  // Max Price
  const [maxPrice, setMaxPrice] = useState<number>();
  // Title
  const [title, setTitle] = useState<string>();

  //-----------------
  // ----- Search-----
  //-----------------

  const [doSearch, { data: dataSearch, loading: loadingSearch }] =
    useLazyQuery<{ items: AdsTypes }>(queryAllAds);
  const searchResult = dataSearch ? dataSearch.items : [];
  const handleSearchClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    doSearch({
      variables: {
        where: {
          subCategory: selectedSubCategory,
          location: { latitude: lat, longitude: long },
          radius,
          minPrice,
          maxPrice,
          title,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
        },
      },
    });
  };

  //-----------------
  // --Reset form-----
  //-----------------

  const resetForm = (): void => {
    setSelectedSubCategory(undefined);
    setSelectedTags([]);
    setLat(undefined);
    setLong(undefined);
    setRadius(30);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setTitle(undefined);
  };

  return (
    <>
      <Box
        className="search"
        sx={{
          backgroundImage: `url(${PATH_IMAGE}/general/search.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {categories && tags && (
          <Box
            className="search_box"
            component="form"
            autoComplete="off"
            onSubmit={handleSearchClick}
          >
            <Box className="search_box_form">
              <Box className="search_box_form_miniBox">
                <FormControl fullWidth>
                  <InputLabel size="small" id="subcategory-select-label">
                    Catégorie*
                  </InputLabel>
                  <Select
                    className="search_input"
                    labelId="subcategory-select-label"
                    id="subcategory-select"
                    size="small"
                    value={selectedSubCategory || ""}
                    onChange={handleChangeCategory}
                    label="Sélectionnez une sous-catégorie"
                    required
                  >
                    <MenuItem value="" disabled>
                      Sélectionnez une catégorie
                    </MenuItem>
                    {categories.map((category) => [
                      <MenuItem key={category.id} value="" disabled>
                        {category.name}
                      </MenuItem>,
                      ...category.subCategories.map((subCategory) => (
                        <MenuItem
                          key={`subcategory-${category.id}-${subCategory.id}`}
                          value={subCategory.id}
                          style={{ marginLeft: "20px" }}
                        >
                          {subCategory.name}
                        </MenuItem>
                      )),
                    ])}
                  </Select>
                </FormControl>
                <GpsAndRadius
                  setLat={setLat}
                  setLong={setLong}
                  setRadius={setRadius}
                  radius={radius}
                />
              </Box>
              {showQueries && (
                <>
                  <Box className="search_box_form_miniBox">
                    <TextField
                      className="search_input"
                      type="number"
                      id="minPrice"
                      size="small"
                      label="Prix minimum €"
                      variant="outlined"
                      value={minPrice || ""}
                      onChange={(e) =>
                        setMinPrice(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                    />
                    <TextField
                      className="search_input"
                      id="title"
                      size="small"
                      label="Quoi ?"
                      variant="outlined"
                      value={title || ""}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Box>
                  <Box className="search_box_form_miniBox">
                    <TextField
                      className="search_input"
                      type="number"
                      id="maxPrice"
                      size="small"
                      label="Prix maximum €"
                      variant="outlined"
                      value={maxPrice || ""}
                      onChange={(e) =>
                        setMaxPrice(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                    />
                    <FormControl>
                      <InputLabel size="small" id="tags">
                        Tag(s)
                      </InputLabel>
                      <Select
                        className="search_input"
                        labelId="tags"
                        id="select-tags"
                        size="small"
                        multiple
                        value={selectedTags}
                        onChange={handleChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) =>
                          selected
                            .map(
                              (id) =>
                                tags.find((tag) => tag.id.toString() === id)
                                  ?.name || "",
                            )
                            .join(", ")
                        }
                      >
                        {tags.map((tag) => (
                          <MenuItem key={tag.id} value={tag.id}>
                            {tag.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </>
              )}
            </Box>
            <Box className="search_box_buttons">
              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={loadingSearch}
              >
                Rechercher
              </Button>
              <Box className="search_box_buttons_filter">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={!showQueries ? <FilterAlt /> : <FilterAltOff />}
                  type="button"
                  onClick={() => setShowQueries(!showQueries)}
                >
                  Filtres
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  type="button"
                  onClick={resetForm}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      {searchResult.length >= 1 && (
        <>
          <h2>
            {searchResult.length === 1
              ? `${searchResult.length} annonce correspond à votre recherche :`
              : `${searchResult.length} annonces correspondent à votre recherche :`}
          </h2>
          <section className="recent-ads">
            {searchResult.map((ads) => (
              <AdCard key={ads.id} ad={ads} />
            ))}
          </section>
        </>
      )}
    </>
  );
}

export default Search;
