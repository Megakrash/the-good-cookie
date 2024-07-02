import { ConversationTypes } from "@/types/ConversationTypes";
import { UserContextTypes } from "@/types/UserTypes";

export function selectOtherUser(
  conversation: ConversationTypes,
  user: UserContextTypes,
) {
  if (conversation.user1.id !== user.id) {
    return conversation.user1;
  }
  return conversation.user2;
}
