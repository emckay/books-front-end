import React from 'react'
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import Book from './Book'

const GET_BOOK = gql`
  query Book($isbn: String!) {
    book(isbn: $isbn) {
      ...BookComponentFields
    }
  }
  ${Book.fragments.book}
`;

export default (props) => (
  <Query query={GET_BOOK} variables={{isbn: props.isbn}}>
    {({loading, error, data}) => {
      if (loading) {
        return 'Fetching data for book';
      }
      if (error) {
        return `Error fetching book ${error}`;
      }
      return <Book book={data.book} {...props} />;
    }}
  </Query>
);
