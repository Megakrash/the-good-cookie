import { gql } from "@apollo/client";

export const queryAllRootCategoriesWithAdCount = gql`
  query CategoriesGetAllRootWithAdCounts {
    items: categoriesGetAllRootWithAdCounts {
      id
      name
      picture
      adCount
    }
  }
`;
