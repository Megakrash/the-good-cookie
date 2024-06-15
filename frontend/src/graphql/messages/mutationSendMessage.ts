import { gql } from "@apollo/client";

export const mutationSendMessage = gql`
  mutation SendMessage($data: MessageCreateInput!) {
    sendMessage(data: $data) {
      id
      adId
      content
      sender {
        id
        nickName
      }
      receiver {
        id
        nickName
      }
      createdAt
    }
  }
`;
