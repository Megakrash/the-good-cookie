import React, { useState } from "react";
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
  Grid,
  useTheme,
} from "@mui/material";
import { FilterAlt, FilterAltOff } from "@mui/icons-material";
import { Toaster } from "react-hot-toast";
import { PATH_IMAGE } from "@/api/configApi";
import { queryAllTags } from "../../graphql/Tags";
import { queryAllAds } from "../../graphql/Ads";
import { queryAllCatAndSub } from "../../graphql/Categories";
import GpsAndRadius from "./components/GpsAndRadius";
import { VariablesColors } from "@/styles/Variables.colors";
import { showToast } from "../utils/toastHelper";

const colors = new VariablesColors();
const { colorLightGrey, colorLightOrange } = colors;

const Search = (): React.ReactNode => {
  const theme = useTheme();
  //-------------------------------------
  // Get Categories&SubCategories & Tags
  //-------------------------------------
  const { data: dataCategories } = useQuery<{ items: CategoriesTypes }>(
    queryAllCatAndSub,
  );
  const categories = dataCategories ? dataCategories.items : [];

  const { data: dataTags } = useQuery<{ items: TagsTypes }>(queryAllTags);
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

  //------------------
  // ----- Search-----
  //------------------

  const [doSearch, { data: dataSearch, loading: loadingSearch }] =
    useLazyQuery<{ items: AdsTypes }>(queryAllAds);
  // const searchResult = dataSearch ? dataSearch.items : [];
  const handleSearchClick = () => {
    if (!selectedSubCategory && !lat && !long) {
      showToast(
        "error",
        `Veuillez indiquer une catégorie et une localisation pour effectuer une recherche.`,
      );
      return;
    }
    doSearch({
      variables: {
        where: {
          subCategory: selectedSubCategory,
          location: {
            type: "Point",
            coordinates: [long, lat],
          },
          radius: radius,
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
    <Grid
      container
      item
      xs={12}
      sx={{
        display: "flex",
        flexDirection: !showQueries ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        minHeight: "270px",
        padding: "1%",
        backgroundImage: `url(${PATH_IMAGE}/general/search.png)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        [theme.breakpoints.down("sm")]: {
          flexDirection: "column",
        },
      }}
    >
      <Toaster />
      <Grid
        container
        item
        xs={10}
        sm={!showQueries ? 5 : 11}
        md={!showQueries ? 4 : 10}
        lg={!showQueries ? 4 : 8}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: !showQueries ? "right" : "center",
          alignItems: "center",
          gap: "20px",
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
          },
        }}
      >
        <Grid
          container
          item
          xs={12}
          sm={!showQueries ? 10 : 5}
          md={!showQueries ? 10 : 5}
          lg={showQueries ? 5 : 11}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <FormControl fullWidth>
            <InputLabel size="small" id="subcategory-select-label">
              Catégorie*
            </InputLabel>
            <Select
              labelId="subcategory-select-label"
              id="subcategory-select"
              size="small"
              sx={{ backgroundColor: colorLightGrey }}
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
        </Grid>
        {showQueries && (
          <Grid
            container
            item
            xs={12}
            sm={5}
            md={5}
            lg={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <TextField
              fullWidth
              type="number"
              id="minPrice"
              size="small"
              label="Prix minimum €"
              sx={{ backgroundColor: colorLightGrey, borderRadius: "5px" }}
              variant="outlined"
              value={minPrice || ""}
              onChange={(e) =>
                setMinPrice(
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
            />
            <TextField
              fullWidth
              id="title"
              size="small"
              label="Quoi ?"
              sx={{ backgroundColor: colorLightGrey, borderRadius: "5px" }}
              variant="outlined"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              type="number"
              id="maxPrice"
              size="small"
              label="Prix maximum €"
              variant="outlined"
              sx={{ backgroundColor: colorLightGrey, borderRadius: "5px" }}
              value={maxPrice || ""}
              onChange={(e) =>
                setMaxPrice(
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
            />
            <FormControl>
              <InputLabel size="small" id="tags">
                Tag(s)
              </InputLabel>
              <Select
                labelId="tags"
                id="select-tags"
                size="small"
                sx={{ backgroundColor: colorLightGrey }}
                multiple
                value={selectedTags}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) =>
                  selected
                    .map(
                      (id) =>
                        tags.find((tag) => tag.id.toString() === id)?.name ||
                        "",
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
          </Grid>
        )}
      </Grid>
      <Grid
        container
        item
        xs={10}
        sm={5}
        md={4}
        lg={3}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: !showQueries ? "left" : "center",
          gap: "20px",
          [theme.breakpoints.down("sm")]: {
            justifyContent: "center",
          },
        }}
      >
        <Button
          variant="contained"
          size="large"
          type="button"
          sx={{ backgroundColor: colorLightOrange, fontWeight: 550 }}
          disabled={loadingSearch}
          onClick={handleSearchClick}
        >
          Rechercher
        </Button>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
            type="button"
            onClick={resetForm}
          >
            Reset
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Search;
