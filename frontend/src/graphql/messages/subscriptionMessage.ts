import { gql } from "@apollo/client";

export const subscriptionMessage = gql`
  subscription newMessage($ad: ID!) {
    newMessage(ad: $ad) {
      id
      ad {
        id
      }
      conversation {
        id
      }
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
