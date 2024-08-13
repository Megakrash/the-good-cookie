import React from "react";
import { useRouter } from "next/router";
import { Box, Divider, MenuItem, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { CategoryTypes } from "@/types/CategoryTypes";
import { queryAllRootCategories } from "@/graphql/categories/queryAllRootCategories";

type BurgerCategoriesProps = {
  handleCloseNavMenu: () => void;
};

const BurgerCategories = (props: BurgerCategoriesProps): React.ReactNode => {
  const router = useRouter();
  const { data } = useQuery<{ items: CategoryTypes[] }>(queryAllRootCategories);
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
            router.push(`/categories/${category.id}`);
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
