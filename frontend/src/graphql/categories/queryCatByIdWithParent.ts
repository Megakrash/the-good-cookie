import { gql } from "@apollo/client";

export const queryCatByIdWithParent = gql`
  query categoryById($categoryByIdId: ID!) {
    item: categoryById(id: $categoryByIdId) {
      id
      name
      picture
      display
      parentCategory {
        id
        name
      }
    }
  }
`;
