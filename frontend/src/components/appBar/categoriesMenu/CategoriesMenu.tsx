import * as React from "react";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import { useQuery } from "@apollo/client";
import { CategoryTypes } from "@/types/CategoryTypes";
import { queryCatByIdAndSub } from "@/graphql/Categories";
import { Box } from "@mui/material";
import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const { colorLightGrey, colorWhite } = colors;

type CategoriesMenuProps = {
  categoryId: Number;
  handleCloseMenu: () => void;
};

const CategoriesMenu = (props: CategoriesMenuProps) => {
  const router = useRouter();
  const { data } = useQuery<{ item: CategoryTypes }>(queryCatByIdAndSub, {
    variables: { categoryByIdId: props.categoryId },
  });
  const categoryAndSub = data ? data.item : null;
  return (
    <Box
      sx={{
        width: { lg: "800px", md: "590px", sm: "590px" },
        display: { xs: "none", sm: "flex" },
      }}
    >
      {categoryAndSub && (
        <>
          <Box
            sx={{
              width: "30%",
              display: "flex",
              justifyContent: "center",
              backgroundColor: colorLightGrey,
            }}
          >
            <Typography variant="h5" textAlign={"center"} sx={{ p: 2 }}>
              {categoryAndSub.name}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: colorWhite,
            }}
          >
            {categoryAndSub.childCategories.map((firstChild) => (
              <React.Fragment key={firstChild.id}>
                <Typography
                  variant="h6"
                  sx={{
                    p: 1,
                  }}
                >
                  {firstChild.name}
                </Typography>
                {firstChild.childCategories?.map((secondChild) => (
                  <React.Fragment key={secondChild.id}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        ml: 2,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        router.push(`/categories/${secondChild.id}`);
                        props.handleCloseMenu();
                      }}
                    >
                      {secondChild.name}
                    </Typography>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};
export default CategoriesMenu;
