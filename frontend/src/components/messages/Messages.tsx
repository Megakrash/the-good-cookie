import React from "react";
import { ConversationsTypes } from "@/types/ConversationTypes";
import { Box, Typography } from "@mui/material";
import ConversationCard from "./ConversationCard";

type MessagesProps = {
  conversations: ConversationsTypes;
};

const Messages: React.FC<MessagesProps> = ({ conversations }) => {
  return (
    <Box
      sx={{
        width: "80%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        padding: 2,
        gap: 3,
      }}
    >
      <Typography variant="h4">Messagerie</Typography>
      {conversations.length === 0 && (
        <Typography variant="h5">
          {`Vous n'avez pas de conversations en cours.`}
        </Typography>
      )}
      {conversations.map((conversation) => (
        <ConversationCard key={conversation.id} conversation={conversation} />
      ))}
    </Box>
  );
};

export default Messages;
