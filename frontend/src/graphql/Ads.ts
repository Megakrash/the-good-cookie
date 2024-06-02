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
      }
    }
  }
`;

export const mutationCreateAd = gql`
  mutation adCreate($data: AdCreateInput!) {
    item: adCreate(data: $data) {
      id
    }
  }
`;

export const mutationUpdateAd = gql`
  mutation adUpdate($data: AdUpdateInput!, $adUpdateId: ID!) {
    item: AdUpdate(data: $data, id: $adUpdateId) {
      id
    }
  }
`;

export const mutationDeleteAd = gql`
  mutation adDelete($adDeleteId: ID!) {
    item: adDelete(id: $adDeleteId) {
      id
      title
    }
  }
`;
