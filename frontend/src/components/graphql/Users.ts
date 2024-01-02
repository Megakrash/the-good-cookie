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
