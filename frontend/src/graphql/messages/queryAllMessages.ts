import { gql } from "@apollo/client";

export const queryAllMessages = gql`
  query GetConversationMessages($data: MessageGetConversationInput!) {
    items: getConversationMessages(data: $data) {
      id
      conversation {
        id
      }
      ad {
        id
        title
      }
      createdAt
      content
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
