import React from "react";
import { useRouter } from "next/router";
import { AppBar, Box, Button, ButtonGroup } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { CategoriesTypes } from "@/types/CategoryTypes";
import { useQuery } from "@apollo/client";
import { queryAllCatAndSub } from "../graphql/Categories";

const Navbar = (): React.ReactNode => {
  const { data } = useQuery<{ items: CategoriesTypes }>(queryAllCatAndSub);
  const categories = data ? data.items : [];
  const router = useRouter();
  const currentPath = router.asPath;

  const pathSegments = currentPath.split("/").filter(Boolean);
  const isCategoryPage = pathSegments[0] === "categories";
  const isSubCategoryPage = pathSegments[0] === "sousCategories";
  const currentId = pathSegments[1];

  // Find the parent category if we're on a subcategory path, otherwise use the current category id.
  const currentCategory = isSubCategoryPage
    ? categories.find((category) =>
        category.subCategories.some(
          (subCat) => subCat.id.toString() === currentId
        )
      )
    : categories.find((category) => category.id.toString() === currentId);

  // Only show subcategories in the AppBar if currentCategory has been determined.
  const showSubCategories =
    currentCategory && (isCategoryPage || isSubCategoryPage);

  return (
    <Box sx={{ position: "sticky", top: -1, zIndex: 1100, marginTop: "-1%" }}>
      <AppBar
        sx={{
          height: "40px",
          width: "100%",
          marginTop: "5px",
          alignItems: "center",
        }}
        position="sticky"
      >
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Disabled elevation buttons"
        >
          <Link href="/">
            <Button sx={{ height: "40px" }}>
              <HomeIcon />
            </Button>
          </Link>
          {categories && (
            <>
              {categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.id}`}>
                  <Button
                    sx={{
                      height: "40px",
                      backgroundColor:
                        currentCategory && currentCategory.id === category.id
                          ? "primary.dark"
                          : null,
                    }}
                  >
                    {category.name}
                  </Button>
                </Link>
              ))}
            </>
          )}
        </ButtonGroup>
      </AppBar>
      {showSubCategories && currentCategory.subCategories && (
        <AppBar
          sx={{
            height: "40px",
            width: "100%",
            alignItems: "center",
          }}
          position="sticky"
          color="secondary"
        >
          <ButtonGroup
            disableElevation
            variant="text"
            aria-label="text button group"
          >
            {currentCategory.subCategories.map((subCat) => (
              <Link
                key={subCat.id}
                href={`/sousCategories/${subCat.id}`}
                passHref
              >
                <Button
                  variant="text"
                  sx={{
                    height: "40px",
                    color: "white",
                    backgroundColor:
                      isSubCategoryPage && subCat.id.toString() === currentId
                        ? "secondary.dark"
                        : null,
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.secondary.light,
                    },
                  }}
                >
                  {subCat.name}
                </Button>
              </Link>
            ))}
          </ButtonGroup>
        </AppBar>
      )}
    </Box>
  );
};
export default Navbar;
