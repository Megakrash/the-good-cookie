import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea } from "@mui/material";
import router from "next/router";
import { CategoryTypes } from "@/types/CategoryTypes";
import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const { colorOrange, colorLightOrange, colorDarkGrey } = colors;

type UniversCardProps = {
  category: CategoryTypes;
};

const UniversCard: React.FC<UniversCardProps> = ({ category }) => {
  // Path images
  const categoryImageUrl = category.picture
    ? `${process.env.NEXT_PUBLIC_PATH_IMAGE}${category.picture}`
    : "/images/default/default.webp";

  return (
    <>
      {category && (
        <CardActionArea
          sx={{
            width: 300,
            height: 390,
          }}
          onClick={() => router.push(`/categories/${category.id}`)}
        >
          <Card
            sx={{
              width: 300,
              height: 390,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "end",
              backgroundImage: `url(${categoryImageUrl})`,
              backgroundSize: "cover",
              padding: 3,
            }}
          >
            <Box
              sx={{
                width: 230,
                backgroundColor: colorLightOrange,
                borderRadius: "5px",
                padding: 1,
                marginBottom: -0.5,
                zIndex: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: colorDarkGrey, textAlign: "center" }}
              >
                {`${category.adCount} annonces`}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 280,
                backgroundColor: colorOrange,
                borderRadius: "5px",
                padding: 1,
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: colorDarkGrey, textAlign: "center" }}
              >
                {category.name}
              </Typography>
            </Box>
          </Card>
        </CardActionArea>
      )}
    </>
  );
};

export default UniversCard;
