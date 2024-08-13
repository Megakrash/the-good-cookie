import { AdTypes } from "./AdTypes";
import { ConversationTypes } from "./ConversationTypes";

export type MessageTypes = {
  id: string;
  ad: AdTypes;
  content: string;
  conversation: ConversationTypes;
  createdAt: string;
  receiver: {
    id: string;
    nickName: string;
  };
  sender: {
    id: string;
    nickName: string;
  };
};
