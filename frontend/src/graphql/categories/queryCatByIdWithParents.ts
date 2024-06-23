import { gql } from "@apollo/client";

export const queryCatByIdWithParents = gql`
  query categoryById($categoryByIdId: ID!) {
    item: categoryById(id: $categoryByIdId) {
      id
      name
      picture
      parentCategory {
        id
        name
        parentCategory {
          id
          name
        }
      }
      childCategories {
        id
        name
        picture
      }
    }
  }
`;
