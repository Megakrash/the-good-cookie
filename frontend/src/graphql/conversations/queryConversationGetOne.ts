import { gql } from "@apollo/client";

export const queryConversationGetOne = gql`
  query ConversationGetOne($adId: String!) {
    item: conversationGetOne(adId: $adId) {
      id
    }
  }
`;
