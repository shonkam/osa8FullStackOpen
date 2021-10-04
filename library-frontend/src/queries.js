import { gql } from '@apollo/client'

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]){
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    )  {
      title
    }
  }
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $setBornTo: Int!){
  editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    name
    born
  }
}
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks  {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!){
  login(
    username: $username,
    password: $password
  ) {   
      value
  }
}
`

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    title,
    author {
      name
    }
  } 
}`