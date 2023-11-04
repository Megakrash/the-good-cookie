import { gql } from "@apollo/client";

export const queryAllAds = gql`
  query adsAll($where: AdsWhere) {
    items: adsGetAll(where: $where) {
      id
      title
      description
      price
      createdDate
      updateDate
      picture
      location
      subCategory {
        id
        name
        category {
          id
          name
        }
      }
      tags {
        id
        name
      }
      user {
        id
        nickName
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
      createdDate
      updateDate
      picture
      location
      subCategory {
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
      }
    }
  }
`;
export const mutationCreateAd = gql`
  mutation adCreate($data: AdCreateInput!) {
    adCreate(data: $data) {
      id
      title
      subCategory {
        id
      }
      user {
        id
        nickName
      }
      tags {
        id
      }
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
