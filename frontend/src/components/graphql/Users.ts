import { gql } from "@apollo/client";

export const mutationCreateUser = gql`
  mutation userCreate($data: UserCreateInput!) {
    item: userCreate(data: $data) {
      id
      nickName
      registrationDate
    }
  }
`;

export const mutationUserLogin = gql`
  mutation userLogin($data: UserLoginInput!) {
    item: userLogin(data: $data) {
      id
      nickName
    }
  }
`;

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
      registrationDate
      isAdmin
    }
  }
`;
