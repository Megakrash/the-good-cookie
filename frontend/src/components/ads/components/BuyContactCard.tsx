import {
  DarkGreyBtnGreyHover,
  OrangeBtnOrangeHover,
} from "@/styles/MuiButtons";
import { AdTypes } from "@/types/AdTypes";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import router from "next/router";
import React from "react";
type BuyContactCardProps = {
  ad: AdTypes;
};
const BuyContactCard: React.FC<BuyContactCardProps> = ({ ad }) => {
  const logoCb = [
    "/images/logos/cb.webp",
    "/images/logos/master.webp",
    "/images/logos/visa.webp",
  ];
  return (
    <Card
      sx={{
        width: 350,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <OrangeBtnOrangeHover>Acheter</OrangeBtnOrangeHover>
        <DarkGreyBtnGreyHover onClick={() => router.push(`/messages`)}>
          Message
        </DarkGreyBtnGreyHover>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="body2">Paiement sécurisé</Typography>
        {logoCb.map((logo, index) => (
          <CardMedia
            key={index}
            component="img"
            sx={{
              width: "auto",
              height: 17,
              objectFit: "contain",
            }}
            image={logo}
            title={logo}
          />
        ))}
      </Box>
    </Card>
  );
};

export default BuyContactCard;
