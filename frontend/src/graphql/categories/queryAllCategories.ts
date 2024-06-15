import { gql } from "@apollo/client";

export const queryAllCategories = gql`
  query CategoriesGetAll {
    items: categoriesGetAll {
      id
      name
    }
  }
`;
