import { gql } from "@apollo/client";

export const mutationUpdateCategory = gql`
  mutation catUpdate($data: CategoryUpdateInput!, $categoryUpdateId: ID!) {
    item: categoryUpdate(data: $data, id: $categoryUpdateId) {
      id
    }
  }
`;
