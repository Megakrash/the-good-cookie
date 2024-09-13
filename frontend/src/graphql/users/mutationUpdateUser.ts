import { gql } from "@apollo/client";

export const mutationUpdateUser = gql`
  mutation UserUpdate($userUpdateId: ID!, $data: UserUpdateInput!) {
    item: userUpdate(id: $userUpdateId, data: $data) {
      id
    }
  }
`;
