import React from "react";
import router from "next/router";
import { CategoryTypes } from "@/types/CategoryTypes";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { VariablesColors } from "@/styles/Variables.colors";
import { PATH_IMAGE } from "@/api/configApi";

const colors = new VariablesColors();
const { colorOrange } = colors;

type CategoryCardProps = {
  category: CategoryTypes;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // Path images
  const adImageUrl = `${PATH_IMAGE}${category.picture}`;
  return (
    <CardActionArea
      sx={{
        width: 220,
      }}
      onClick={() => router.push(`/categories/${category.id}`)}
    >
      <Card
        sx={{
          width: 220,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          "&:hover": {
            border: (theme) => `2px solid ${theme.palette.primary.main}`,
          },
        }}
      >
        {category.picture && (
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
            image={adImageUrl}
            title={category.name}
          />
        )}

        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 1,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {category.name}
          </Typography>

          <ArrowForwardIosIcon sx={{ color: colorOrange }} />
        </Box>
      </Card>
    </CardActionArea>
  );
};

export default CategoryCard;
