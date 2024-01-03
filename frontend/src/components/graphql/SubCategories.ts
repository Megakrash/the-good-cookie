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
        createdDate
        updateDate
        picture
        city
        tags {
          id
          name
        }
        user {
          id
          nickName
          picture
        }
      }
      category {
        id
        name
      }
    }
  }
`;
