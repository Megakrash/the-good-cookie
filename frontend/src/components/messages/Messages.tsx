import React from "react";
import { ConversationsTypes } from "@/types/ConversationTypes";
import { Box, Divider, Grid, Typography } from "@mui/material";
import ConversationCard from "./ConversationCard";

type MessagesProps = {
  conversations: ConversationsTypes;
};

const Messages: React.FC<MessagesProps> = ({ conversations }) => {
  return (
    <Grid
      container
      xs={11}
      sm={10}
      md={10}
      lg={8}
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
      <Divider />
      {conversations.length === 0 && (
        <Typography variant="h5">
          {`Vous n'avez pas de conversations en cours.`}
        </Typography>
      )}
      {conversations.map((conversation) => (
        <ConversationCard key={conversation.id} conversation={conversation} />
      ))}
    </Grid>
  );
};

export default Messages;
