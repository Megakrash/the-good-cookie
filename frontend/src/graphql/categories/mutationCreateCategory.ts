import { gql } from "@apollo/client";

export const mutationCreateCategory = gql`
  mutation categoryCreate($data: CategoryCreateInput!) {
    item: categoryCreate(data: $data) {
      id
    }
  }
`;
