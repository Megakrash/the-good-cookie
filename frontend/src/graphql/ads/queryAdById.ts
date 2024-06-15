import { gql } from "@apollo/client";

export const queryAdById = gql`
  query AdById($adByIdId: ID!) {
    item: adById(id: $adByIdId) {
      id
      title
      description
      price
      createdAt
      updatedAt
      city
      zipCode
      location {
        coordinates
      }
      picture {
        id
        filename
      }
      category {
        id
        name
        parentCategory {
          id
          name
          parentCategory {
            id
            name
          }
        }
      }
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
        ads {
          id
        }
      }
    }
  }
`;
