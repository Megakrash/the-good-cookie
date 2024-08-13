import { gql } from "@apollo/client";

export const mutationCreateConversation = gql`
  mutation ConversationCreate($data: ConversationCreateInput!) {
    item: conversationCreate(data: $data) {
      id
    }
  }
`;
