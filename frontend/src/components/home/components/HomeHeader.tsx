import { Box, Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const { colorWhite } = colors;

const HomeHeader = (): React.ReactNode => {
  const theme = useTheme();
  return (
    <Grid
      container
      item
      xs={12}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        height: "400px",
        padding: "1%",
        backgroundImage: `url(/images/general/mega-cookies.webp)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        [theme.breakpoints.down("lg")]: {
          height: "300px",
        },
        [theme.breakpoints.down("md")]: {
          height: "250px",
        },
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          background: "rgba(0, 0, 0, 0.3)",
          padding: "1%",
          borderRadius: "10px",
          backdropFilter: "blur(1.5px)",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: "2rem",
            color: colorWhite,
          }}
        >
          Les petites annonces en cookies,
        </Typography>
        <Typography
          variant="h3"
          sx={{
            mt: "10px",
            fontSize: "2rem",
            color: colorWhite,
          }}
        >
          proches de chez vous.
        </Typography>
      </Box>
    </Grid>
  );
};

export default HomeHeader;
