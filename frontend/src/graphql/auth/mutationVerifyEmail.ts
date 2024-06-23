import { gql } from "@apollo/client";

export const mutationVerifyEmail = gql`
  mutation verifyEmail($token: String!) {
    item: verifyEmail(token: $token) {
      success
      message
    }
  }
`;
