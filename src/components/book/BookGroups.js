import React from 'react';
import Book from './Book';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {CardDeck, Col} from 'reactstrap';

const makeBookGroup = (query) => ({variables}) => (
  <Query query={query} variables={variables}>
    {({loading, error, data}) => {
      if (loading) {
        return 'Fetching data for book';
      }
      if (error) {
        return `Error fetching book ${error}`;
      }
      return (
        <div className="recent-books">
          <CardDeck>
            {data.readings.map((reading, i) => (
              <Col key={i} lg={4}>
                <Book book={reading.book} />
              </Col>
            ))}
          </CardDeck>
        </div>
      );
    }}
  </Query>
);

const GET_IN_PROGRESS_BOOKS = gql`
  query readings {
    readings(
      orderBy: "endDate"
      order: "desc"
      filter: [
        {field: "endDate", value: {eq: "$NULL"}}
        {field: "startDate", value: {not: "$NULL"}}
      ]
    ) {
      rating
      endDate
      book {
        ...BookComponentFields
      }
    }
  }
  ${Book.fragments.book}
`;
export const InProgressBooks = makeBookGroup(GET_IN_PROGRESS_BOOKS);

const makeContrarinessQuery = (order) => gql`
  query readings($count: Int!) {
    readings(
      limit: $count
      orderBy: "contrarinessAbs"
      order: "${order}"
      filter: [
        {field: "endDate", value: {not: "$NULL"}}
        {field: "startDate", value: {not: "$NULL"}}
      ]
    ) {
      rating
      endDate
      book {
        ...BookComponentFields
      }
    }
  }
  ${Book.fragments.book}
`;
export const MostContrarianBooks = makeBookGroup(makeContrarinessQuery('desc'));
export const LeastContrarianBooks = makeBookGroup(makeContrarinessQuery('asc'));

const GET_RECENT_BOOKS = gql`
  query readings($count: Int!) {
    readings(
      limit: $count
      orderBy: "endDate"
      order: "desc"
      filter: [
        {field: "endDate", value: {not: "$NULL"}}
        {field: "startDate", value: {not: "$NULL"}}
      ]
    ) {
      rating
      endDate
      book {
        ...BookComponentFields
      }
    }
  }
  ${Book.fragments.book}
`;
export const RecentBooks = makeBookGroup(GET_RECENT_BOOKS);
