import { gql } from "@apollo/client";

export const queryAllMessages = gql`
  query GetConversationMessages($data: MessageConversationInput!) {
    items: getConversationMessages(data: $data) {
      id
      adId
      content
      createdAt
      receiver {
        id
        nickName
      }
      sender {
        id
        nickName
      }
    }
  }
`;
