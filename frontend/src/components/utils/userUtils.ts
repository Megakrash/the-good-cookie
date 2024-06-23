import { ConversationTypes } from "@/types/ConversationTypes";
import { UserContextTypes } from "@/types/UserTypes";

export function selectOtherUser(
  conversation: ConversationTypes,
  user: UserContextTypes,
) {
  if (Number(conversation.user1.id) !== Number(user.id)) {
    return conversation.user1;
  }
  return conversation.user2;
}
