import React from "react";
import { useRouter } from "next/router";
import { Box, Divider, MenuItem, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { CategoriesTypes } from "@/types/CategoryTypes";
import { queryAllCat } from "@/graphql/Categories";

type BurgerCategoriesProps = {
  handleCloseNavMenu: () => void;
};

const BurgerCategories = (props: BurgerCategoriesProps): React.ReactNode => {
  const router = useRouter();
  const { data } = useQuery<{ items: CategoriesTypes }>(queryAllCat);
  const categories = data ? data.items : [];
  return (
    <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "column" }}>
      <Typography sx={{ marginLeft: "15px", fontWeight: "600" }}>
        Catégories
      </Typography>
      {categories.map((category) => (
        <MenuItem
          key={category.id}
          onClick={() => {
            props.handleCloseNavMenu();
            router.replace(`/category/${category.id}`);
          }}
        >
          <Typography textAlign="center">{category.name}</Typography>
        </MenuItem>
      ))}
      <Divider />
    </Box>
  );
};

export default BurgerCategories;