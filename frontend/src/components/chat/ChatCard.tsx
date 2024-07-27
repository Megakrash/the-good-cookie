import React from "react";
import { MessageTypes } from "@/types/MessageTypes";
import { UserContextTypes } from "@/types/UserTypes";
import {
  Card,
  Typography,
  Divider,
  Box,
  TextField,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const { colorOrange, colorLightOrange, colorDarkGrey } = colors;

type ChatCardProps = {
  conversation: MessageTypes[];
  user: UserContextTypes;
  messageContent: string;
  setMessageContent: (value: string) => void;
  handleSendMessage: () => void;
};
const ChatCard: React.FC<ChatCardProps> = ({
  conversation,
  user,
  messageContent,
  setMessageContent,
  handleSendMessage,
}) => {
  return (
    <Card sx={{ width: "90%", maxWidth: 500, mt: 5, ml: 3, p: 1 }}>
      <Typography variant="h4" gutterBottom component="div">
        {conversation.length > 0
          ? conversation[0]?.ad.title
          : "Nouvelle conversation"}
      </Typography>
      <Divider />
      <Box sx={{ overflowY: "auto", mb: 2, mt: 2 }}>
        {conversation.map((msg) => (
          <Card
            key={msg.id}
            sx={{
              maxWidth: 345,
              my: 1.5,
              p: 1,
              backgroundColor:
                msg.sender.nickName === user.nickName
                  ? colorOrange
                  : colorLightOrange,
              marginLeft:
                msg.sender.nickName === user.nickName ? "auto" : "inherit",
              marginRight:
                msg.sender.nickName === user.nickName ? "inherit" : "auto",
              textAlign:
                msg.sender.nickName === user.nickName ? "right" : "left",
            }}
          >
            <Typography color={colorDarkGrey} gutterBottom>
              {msg.sender.nickName}
            </Typography>
            <Typography color={colorDarkGrey} variant="body2">
              {msg.content}
            </Typography>
          </Card>
        ))}
      </Box>
      <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          fullWidth
          size="small"
          label="Ecrire un message"
          variant="outlined"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
        >
          Envoyer
        </Button>
      </Box>
    </Card>
  );
};

export default ChatCard;
