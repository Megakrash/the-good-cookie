import { gql } from "@apollo/client";

export const mutationDeleteAd = gql`
  mutation adDelete($adDeleteId: ID!) {
    item: adDelete(id: $adDeleteId) {
      id
      title
    }
  }
`;
