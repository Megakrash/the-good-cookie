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
            <Typography variant="h6" textAlign={"center"} sx={{ p: 2 }}>
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
            {categoryAndSub.subCategories.map((sub) => (
              <React.Fragment key={sub.id}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    p: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    router.push(`/sub/${sub.id}`);
                  }}
                >
                  {sub.name}
                </Typography>
              </React.Fragment>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};
export default CategoriesMenu;
