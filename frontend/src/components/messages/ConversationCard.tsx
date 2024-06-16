import React, { useEffect, useState } from "react";
import { ConversationTypes } from "@/types/ConversationTypes";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Divider,
  Typography,
} from "@mui/material";
import router from "next/router";
import { getUserImageUrl } from "../utils/pictureUtils";
import { transformerDate } from "../utils/dateUtils";
import { useUserContext } from "@/context/UserContext";
import { selectOtherUser } from "../utils/userUtils";
import { UserTypes } from "@/types/UserTypes";

type MessagesProps = {
  conversation: ConversationTypes;
};

const ConversationCard: React.FC<MessagesProps> = ({ conversation }) => {
  const { user } = useUserContext();
  const [displayUser, setDisplayUser] = useState<UserTypes | null>(null);

  useEffect(() => {
    const otherUser: UserTypes = selectOtherUser(conversation, user);
    setDisplayUser(otherUser);
  }, [conversation, user]);

  const avatarPictureUrl = getUserImageUrl(displayUser?.picture?.filename);
  const updatedAt = transformerDate(conversation.updatedAt);
  return (
    <CardActionArea onClick={() => router.push(`/messages/${conversation.id}`)}>
      <Card
        sx={{
          minHeight: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 1,
          padding: 1,
          "&:hover": {
            border: (theme) => `2px solid ${theme.palette.primary.main}`,
          },
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
          variant="h6"
        >
          {`Sujet : ${conversation.ad.title}`}
        </Typography>
        <Divider />
        {/* User & updated date */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* User */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {displayUser && (
              <>
                <Avatar
                  alt={conversation.user1.nickName}
                  sx={{ width: "35px", height: "35px" }}
                  src={avatarPictureUrl}
                />
                <Typography variant="body2" color="text.secondary">
                  {displayUser.nickName}
                </Typography>
              </>
            )}
          </Box>
          <Typography variant="body2">{`Dernier message le ${updatedAt}`}</Typography>
        </Box>
      </Card>
    </CardActionArea>
  );
};

export default ConversationCard;
