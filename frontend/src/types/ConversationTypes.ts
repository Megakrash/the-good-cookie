import { AdTypes } from "./AdTypes";
import { MessageTypes } from "./MessageTypes";
import { UserTypes } from "./UserTypes";

export type ConversationTypes = {
  id: string;
  ad: AdTypes;
  messages: MessageTypes[];
  user1: UserTypes;
  user2: UserTypes;
  updatedAt: string;
};
