import { gql } from "@apollo/client";

export const mutationUpdateAd = gql`
  mutation adUpdate($data: AdUpdateInput!, $adUpdateId: ID!) {
    item: AdUpdate(data: $data, id: $adUpdateId) {
      id
    }
  }
`;
