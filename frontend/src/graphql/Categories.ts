import { gql } from "@apollo/client";

export const mutationCreateCategory = gql`
  mutation categoryCreate($data: CategoryCreateInput!) {
    item: categoryCreate(data: $data) {
      id
    }
  }
`;

export const queryAllCat = gql`
  query CategoriesGetAll {
    items: categoriesGetAll {
      id
      name
    }
  }
`;

export const queryAllCatAndSub = gql`
  query getAllCategoriesAndSub {
    items: categoriesGetAll {
      id
      name
      subCategories {
        id
        name
      }
    }
  }
`;

export const queryCatByIdAndSub = gql`
  query categoryById($categoryByIdId: ID!) {
    item: categoryById(id: $categoryByIdId) {
      id
      name
      subCategories {
        id
        name
        picture {
          id
          filename
        }
      }
    }
  }
`;
