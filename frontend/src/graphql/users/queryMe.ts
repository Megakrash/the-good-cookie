import { gql } from "@apollo/client";

export const queryMe = gql`
  query me {
    item: me {
      id
      firstName
      lastName
      nickName
      email
      picture
      adress
      zipCode
      city
      phoneNumber
      createdAt
      updatedAt
      lastConnectionDate
      role
    }
  }
`;
