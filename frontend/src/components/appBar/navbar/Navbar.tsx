import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Popover,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { CategoryTypes } from "@/types/CategoryTypes";
import { useQuery } from "@apollo/client";
import { queryAllRootCategories } from "@/graphql/categories/queryAllRootCategories";
import { VariablesColors } from "@/styles/Variables.colors";
import CategoriesMenu from "../categoriesMenu/CategoriesMenu";

const colors = new VariablesColors();
const { colorOrange } = colors;

const Navbar = (): React.ReactNode => {
  // Get all categories
  const { data } = useQuery<{ items: CategoryTypes[] }>(queryAllRootCategories);
  const categories = data ? data.items : [];

  const [anchorElMenu, setAnchorElMenu] = useState<HTMLButtonElement | null>(
    null,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  // Open menu
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    categoryId: string,
  ) => {
    setAnchorElMenu(event.currentTarget);
    setSelectedCategoryId(categoryId);
  };

  // Close menu
  const handleCloseMenu = () => {
    setAnchorElMenu(null);
    setSelectedCategoryId(null);
  };

  const open = Boolean(anchorElMenu);

  // Responsive design popovers
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const isLg = useMediaQuery(theme.breakpoints.down("lg"));
  let leftPosition = 0;
  if (isXs) {
    leftPosition = window.innerWidth * 0;
  } else if (isLg) {
    leftPosition = window.innerWidth * 0;
  } else {
    leftPosition = window.innerWidth * 0.15;
  }

  return (
    <Box
      sx={{
        position: "sticky",
        width: "100%",
        minHeight: "40px",
        display: { xs: "none", sm: "flex" },
        backgroundColor: colorOrange,
        top: -1,
        zIndex: 1100,
      }}
    >
      <Box
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "row",
          justifyContent: { md: "none", lg: "center" },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Disabled elevation buttons"
          sx={{ whiteSpace: "nowrap", height: "40px" }}
        >
          <Link href="/">
            <Button sx={{ height: "40px", backgroundColor: colorOrange }}>
              <HomeIcon />
            </Button>
          </Link>
          {categories && (
            <>
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  <Button
                    sx={{
                      height: "40px",
                      backgroundColor: colorOrange,
                    }}
                    onClick={(event) => handleClick(event, category.id)}
                  >
                    {category.name}
                  </Button>
                </React.Fragment>
              ))}
            </>
          )}
        </ButtonGroup>
        <Popover
          open={open}
          anchorEl={anchorElMenu}
          onClose={handleCloseMenu}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 110, left: leftPosition }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          {selectedCategoryId && (
            <CategoriesMenu
              categoryId={selectedCategoryId}
              handleCloseMenu={handleCloseMenu}
            />
          )}
        </Popover>
      </Box>
    </Box>
  );
};

export default Navbar;
