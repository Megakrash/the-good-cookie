import { AdTypes } from "./AdTypes";
import { ConversationTypes } from "./ConversationTypes";

export type MessageTypes = {
  id: number;
  ad: AdTypes;
  content: string;
  conversation: ConversationTypes;
  createdAt: string;
  receiver: {
    id: number;
    nickName: string;
  };
  sender: {
    id: number;
    nickName: string;
  };
};

export type MessagesTypes = MessageTypes[];
