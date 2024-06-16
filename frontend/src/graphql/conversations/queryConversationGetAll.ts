import { gql } from "@apollo/client";

export const queryConversationGetAll = gql`
  query ConversationGetAll {
    items: conversationGetAll {
      id
      ad {
        id
        title
      }
      user1 {
        id
        nickName
        picture {
          id
          filename
        }
      }
      user2 {
        id
        nickName
        picture {
          id
          filename
        }
      }
      messages {
        content
      }
      updatedAt
    }
  }
`;
