import * as React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useQuery } from "@apollo/client";
import { CategoriesTypes, CategoryTypes } from "@/types/CategoryTypes";
import { queryAllCatWithHierarchy } from "@/graphql/Categories";
import { SelectChangeEvent } from "@mui/material/Select";
import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const { colorLightGrey, colorWhite } = colors;

type CategorySelectProps = {
  selectedCategory: number;
  setSelectedCategory: (selectedCategory: number) => void;
  type: "createCategory" | "createAd" | "updateAd";
};

const CategorySelect: React.FC<CategorySelectProps> = (
  props: CategorySelectProps,
) => {
  // Get all categories
  const { data } = useQuery<{ items: CategoriesTypes }>(
    queryAllCatWithHierarchy,
  );

  const categories = data ? data.items : [];

  // Render categories CSS
  const renderMenuItems = (category: CategoryTypes, level = 0) => {
    const indent = level * 20;
    let fontWeight: string;
    switch (level) {
      case 0:
        fontWeight = "bold";
        break;
      case 1:
        fontWeight = "600";
        break;
      default:
        fontWeight = "normal";
    }

    // Disable categories with children if type is createAd or updateAd
    const isDisabled =
      props.type === "createAd" &&
      category.childCategories &&
      category.childCategories.length > 0;

    return [
      <MenuItem
        key={category.id}
        value={category.id}
        style={{ marginLeft: indent, fontWeight: fontWeight }}
        disabled={isDisabled}
      >
        {category.name}
      </MenuItem>,
      ...(category.childCategories
        ? category.childCategories.flatMap((child) =>
            renderMenuItems(child, level + 1),
          )
        : []),
    ];
  };

  const handleChange = (event: SelectChangeEvent<number>) => {
    props.setSelectedCategory(Number(event.target.value));
  };

  return (
    <FormControl fullWidth>
      <InputLabel size="small" id="category-select-label">
        {props.type === "updateAd" || "createCategory"
          ? "Catégorie"
          : "Catégorie*"}
      </InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        size="small"
        sx={{
          backgroundColor:
            props.type === "createAd" || "updateAd"
              ? colorWhite
              : colorLightGrey,
        }}
        value={props.selectedCategory || ""}
        onChange={handleChange}
        label="Catégorie"
        required={!(props.type === "updateAd" || "createCategory")}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 450,
            },
          },
        }}
      >
        <MenuItem value="" disabled>
          Sélectionnez une catégorie
        </MenuItem>
        {categories.flatMap((category) => renderMenuItems(category))}
      </Select>
    </FormControl>
  );
};

export default CategorySelect;
