import { gql } from "@apollo/client";

export const subscriptionMessage = gql`
  subscription newMessage($adId: Float!) {
    newMessage(adId: $adId) {
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
