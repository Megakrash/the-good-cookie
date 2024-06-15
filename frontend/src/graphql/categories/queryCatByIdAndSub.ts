import { gql } from "@apollo/client";

export const queryCatByIdAndSub = gql`
  query categoryById($categoryByIdId: ID!) {
    item: categoryById(id: $categoryByIdId) {
      id
      name
      childCategories {
        id
        name
        childCategories {
          id
          name
        }
      }
    }
  }
`;
