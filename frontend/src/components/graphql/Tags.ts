import { gql } from '@apollo/client';

export const queryAllTags = gql`
  query queryAllTags {
    items: tagsGetAll {
      id
      name
    }
  }
`;
