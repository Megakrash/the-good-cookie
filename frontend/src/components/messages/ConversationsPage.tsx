import React from "react";
import { ConversationTypes } from "@/types/ConversationTypes";
import { Divider, Grid, Typography } from "@mui/material";
import ConversationCard from "./ConversationCard";

type ConversationsPageProps = {
  conversations: ConversationTypes[];
};

const ConversationsPage: React.FC<ConversationsPageProps> = ({
  conversations,
}) => {
  return (
    <Grid
      container
      item
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

export default ConversationsPage;
