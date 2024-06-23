import { gql } from "@apollo/client";

export const mutationSendMessage = gql`
  mutation sendMessage($data: MessageCreateInput!) {
    sendMessage(data: $data) {
      id
      ad {
        id
      }
      conversation {
        id
      }
      content
      createdAt
      sender {
        id
        nickName
      }
      receiver {
        id
        nickName
      }
    }
  }
`;
