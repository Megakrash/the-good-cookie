import { showToast } from "@/components/utils/toastHelper";
import { useUserContext } from "@/context/UserContext";
import { mutationCreateConversation } from "@/graphql/conversations/mutationCreateConversation";
import { queryConversationGetOne } from "@/graphql/conversations/queryConversationGetOne";
import {
  DarkGreyBtnGreyHover,
  OrangeBtnOrangeHover,
} from "@/styles/MuiButtons";
import { AdTypes } from "@/types/AdTypes";
import { ConversationTypes } from "@/types/ConversationTypes";
import { useMutation, useQuery } from "@apollo/client";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import router from "next/router";
import React from "react";
import { Toaster } from "react-hot-toast";
type BuyContactCardProps = {
  ad: AdTypes;
};
const logosCb = [
  "/images/logos/cb.webp",
  "/images/logos/master.webp",
  "/images/logos/visa.webp",
];
const BuyContactCard: React.FC<BuyContactCardProps> = ({ ad }) => {
  const { user } = useUserContext();
  // Get conversation if exists
  const { data } = useQuery<{
    item: ConversationTypes;
  }>(queryConversationGetOne, {
    variables: {
      adId: ad.id,
    },
  });
  const conversation = data?.item || null;

  // CREATE CONVERSATION if not exists
  const [doCreate] = useMutation(mutationCreateConversation, {
    variables: {
      data: {
        ad: { id: ad.id },
        user2: { id: ad.user.id },
      },
    },
    onCompleted: (data) => {
      router.push(
        `/messages/${data.item.id}?ad=${ad.id}&receiver=${ad.user.id}`,
      );
    },
    onError: (error) => {
      if (error.message === "You cannot contact yourself") {
        showToast("error", "Vous ne pouvez pas vous contacter vous-même");
      }
    },
  });

  // Handle click on message button
  const handleClickMessage = () => {
    // Check if user is authenticated
    if (!user) {
      localStorage.setItem("previousUrl", router.asPath);
      router.push("/signin");
      return;
    }
    // Check if conversation already exists
    if (conversation) {
      router.push(
        `/messages/${conversation.id}?ad=${ad.id}&receiver=${ad.user.id}`,
      );
      return;
    } else doCreate();
  };
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
      <Toaster />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <OrangeBtnOrangeHover>Acheter</OrangeBtnOrangeHover>
        <DarkGreyBtnGreyHover onClick={handleClickMessage}>
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
        {logosCb.map((logo, index) => (
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
