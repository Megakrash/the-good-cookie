import React from "react";
import { Box, Button, ButtonGroup } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { CategoriesTypes } from "@/types/CategoryTypes";
import { useQuery } from "@apollo/client";
import { queryAllCatAndSub } from "../graphql/Categories";
import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const { colorOrange } = colors;

const Navbar = (): React.ReactNode => {
  const { data } = useQuery<{ items: CategoriesTypes }>(queryAllCatAndSub);
  const categories = data ? data.items : [];

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
                <Button
                  key={category.id}
                  sx={{
                    height: "40px",
                    backgroundColor: colorOrange,
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </>
          )}
        </ButtonGroup>
      </Box>
    </Box>
  );
};
export default Navbar;
