import * as React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useQuery } from "@apollo/client";
import { CategoriesTypes, CategoryTypes } from "@/types/CategoryTypes";
import { queryAllCatWithHierarchy } from "@/graphql/Categories";
import { SelectChangeEvent } from "@mui/material/Select";

type CategorySelectProps = {
  selectedCategory: number;
  setSelectedCategory: (selectedCategory: number) => void;
};

const CategorySelect: React.FC<CategorySelectProps> = (
  props: CategorySelectProps,
) => {
  const { data } = useQuery<{ items: CategoriesTypes }>(
    queryAllCatWithHierarchy,
  );

  const categories = data ? data.items : [];

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

    return [
      <MenuItem
        key={category.id}
        value={category.id}
        style={{ marginLeft: indent, fontWeight: fontWeight }}
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
        Catégorie
      </InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        size="small"
        value={props.selectedCategory}
        onChange={handleChange}
        label="Catégorie"
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
