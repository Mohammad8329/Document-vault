import { gql } from '@apollo/client';

export const GET_COLLECTIONS = gql`
  query GetCollections {
    collections {
      id
      name
      slug
      createdAt
      documents {
        id
        isArchived
      }
    }
  }
`;

export const GET_COLLECTION = gql`
  query GetCollection($id: ID!) {
    collection(id: $id) {
      id
      name
      slug
      createdAt
      documents {
        id
        title
        content
        tags
        isArchived
        createdAt
        updatedAt
        collectionId
      }
    }
  }
`;

export const GET_DOCUMENTS = gql`
  query GetDocuments(
    $collectionId: ID
    $search: String
    $isArchived: Boolean
    $take: Int
    $after: String
  ) {
    documents(
      collectionId: $collectionId
      search: $search
      isArchived: $isArchived
      take: $take
      after: $after
    ) {
      edges {
        cursor
        node {
          id
          title
          content
          tags
          isArchived
          createdAt
          updatedAt
          collectionId
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const CREATE_COLLECTION = gql`
  mutation CreateCollection($name: String!, $slug: String!) {
    createCollection(name: $name, slug: $slug) {
      id
      name
      slug
      createdAt
    }
  }
`;

export const CREATE_DOCUMENT = gql`
  mutation CreateDocument(
    $collectionId: ID!
    $title: String!
    $content: String!
    $tags: [String!]
  ) {
    createDocument(
      collectionId: $collectionId
      title: $title
      content: $content
      tags: $tags
    ) {
      id
      title
      content
      tags
      isArchived
      createdAt
      updatedAt
      collectionId
    }
  }
`;

export const UPDATE_DOCUMENT = gql`
  mutation UpdateDocument(
    $id: ID!
    $title: String
    $content: String
    $tags: [String!]
    $isArchived: Boolean
  ) {
    updateDocument(
      id: $id
      title: $title
      content: $content
      tags: $tags
      isArchived: $isArchived
    ) {
      id
      title
      content
      tags
      isArchived
      createdAt
      updatedAt
      collectionId
    }
  }
`;

export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id)
  }
`;

export const MOVE_DOCUMENT = gql`
  mutation MoveDocument($id: ID!, $collectionId: ID!) {
    moveDocument(id: $id, collectionId: $collectionId) {
      id
      title
      collectionId
      updatedAt
    }
  }
`;
