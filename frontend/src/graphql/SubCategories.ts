import { gql } from "@apollo/client";

export const querySubCatAndAds = gql`
  query subCategoryById($subCategoryByIdId: ID!) {
    item: subCategoryById(id: $subCategoryByIdId) {
      id
      name
      ads {
        id
        title
        description
        price
        createdAt
        updatedAt
        picture {
          id
          filename
        }
        city
        tags {
          id
          name
        }
        user {
          id
          nickName
          picture {
            id
            filename
          }
        }
      }
      category {
        id
        name
      }
    }
  }
`;

export const mutationCreateSubCategory = gql`
  mutation subCreate($data: SubCategoryCreateInput!) {
    item: subCategoryCreate(data: $data) {
      id
    }
  }
`;
