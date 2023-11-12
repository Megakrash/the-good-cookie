import React, { FormEvent, useState } from "react";
import AdCard from "../ads/AdCard";
import { CategoriesTypes, AdsTypes, TagsTypes } from "@/types";
import { queryAllCatAndSub } from "../graphql/Categories";
import { queryAllAds } from "../graphql/Ads";
import { queryAllTags } from "../graphql/Tags";
import { useLazyQuery, useQuery } from "@apollo/client";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
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
          tags: selectedTags.length > 0 ? selectedTags : undefined,
        },
      },
    });
  };

  //-----------------
  //--Reset form-----
  //-----------------

  const resetForm = (): void => {
    setSelectedSubCategory(undefined);
    setSelectedTags([]);
    setSelectedLocation(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setTitle(undefined);
  };

  return (
    <React.Fragment>
      {categories && tags && (
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "20ch" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSearchClick}
        >
          <FormControl fullWidth>
            <InputLabel id="subcategory-select-label">Catégorie</InputLabel>
            <Select
              labelId="subcategory-select-label"
              id="subcategory-select"
              value={selectedSubCategory || ""}
              onChange={handleChangeCategory}
              label="Sélectionnez une sous-catégorie"
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
          <TextField
            id="location"
            size="small"
            label="Où ?"
            variant="outlined"
            value={selectedLocation || ""}
            onChange={(e) => setSelectedLocation(e.target.value)}
            required
          />

          {showQueries && (
            <>
              <TextField
                id="title"
                size="small"
                label="Quoi ?"
                variant="outlined"
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
              />

              <TextField
                type="number"
                id="minPrice"
                size="small"
                label="Prix minimum €"
                variant="outlined"
                value={minPrice || ""}
                onChange={(e) =>
                  setMinPrice(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
              />
              <TextField
                type="number"
                id="mexPrice"
                size="small"
                label="Prix maximum €"
                variant="outlined"
                value={maxPrice || ""}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
              />
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="tags">Tag(s)</InputLabel>
                <Select
                  labelId="tags"
                  id="select-tags"
                  multiple
                  value={selectedTags}
                  onChange={handleChange}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) =>
                    selected
                      .map(
                        (id) =>
                          tags.find((tag) => tag.id.toString() === id)?.name ||
                          ""
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
            </>
          )}

          <>
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
              variant="contained"
              size="small"
              type="submit"
              disabled={loadingSearch}
            >
              Rechercher
            </Button>

            <Button
              variant="outlined"
              size="small"
              type="button"
              onClick={resetForm}
            >
              Reset
            </Button>
          </>
        </Box>
      )}
      {searchResult.length >= 1 && (
        <>
          <h2>
            {searchResult.length} annonces correspondent à votre recherche :
          </h2>
          <section className="recent-ads">
            {searchResult.map((ads) => (
              <AdCard key={ads.id} ad={ads} />
            ))}
          </section>
        </>
      )}
    </React.Fragment>
  );
};

export default Search;
