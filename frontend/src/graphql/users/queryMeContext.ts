import { gql } from "@apollo/client";

export const queryMeContext = gql`
  query meContext {
    item: meContext {
      id
      nickName
      role
      picture {
        id
        filename
      }
    }
  }
`;
