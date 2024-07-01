import { gql } from "@apollo/client";

export const queryAllCategories = gql`
  query CategoriesGetAll {
    items: categoriesGetAll {
      id
      name
      parentCategory {
        id
        name
      }
      childCategories {
        id
        name
      }
      createdAt
      updatedAt
      display
    }
  }
`;
