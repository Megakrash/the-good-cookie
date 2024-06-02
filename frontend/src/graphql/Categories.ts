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

export const queryAllRootCat = gql`
  query CategoriesGetaLLRoot {
    items: categoriesGetaLLRoot {
      id
      name
    }
  }
`;

export const queryAllCatWithHierarchy = gql`
  query CategoriesGetAllWithHierarchy {
    items: categoriesGetAllWithHierarchy {
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
      ads {
        id
        title
      }
    }
  }
`;

export const queryCatByIdWithAds = gql`
  query categoryById($categoryByIdId: ID!) {
    item: categoryById(id: $categoryByIdId) {
      id
      name
      picture {
        id
        filename
      }
      ads {
        id
        title
        picture {
          id
          filename
        }
      }
    }
  }
`;
