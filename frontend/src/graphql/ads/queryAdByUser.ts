import { gql } from "@apollo/client";

export const queryAdByUser = gql`
  query adsByUser($adsByUserId: ID!) {
    items: adsByUser(id: $adsByUserId) {
      id
      picture
      title
      description
      price
      zipCode
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
  }
`;
