import { gql } from "@apollo/client";

export const queryAllAds = gql`
  query adsAll($where: AdsWhere) {
    items: adsGetAll(where: $where) {
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
      zipCode
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
  }
`;
