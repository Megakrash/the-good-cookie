import { gql } from "@apollo/client";

export const queryAllUsers = gql`
  query usersGetAll {
    items: usersGetAll {
      id
      email
      firstName
      lastName
      nickName
      phoneNumber
      profil
      gender
      role
      updatedAt
      updatedBy {
        nickName
      }
      createdAt
      city
      adress
      zipCode
    }
  }
`;
