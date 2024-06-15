import { gql } from "@apollo/client";

export const queryAllRootCategories = gql`
  query CategoriesGetaLLRoot {
    items: categoriesGetaLLRoot {
      id
      name
    }
  }
`;
