import { gql } from "@apollo/client";

export const mutationCreateAd = gql`
  mutation adCreate($data: AdCreateInput!) {
    item: adCreate(data: $data) {
      id
    }
  }
`;
