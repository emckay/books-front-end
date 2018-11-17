import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import gql from 'graphql-tag';
import Book from './book/Book';
import {Query} from 'react-apollo';
import {DateTime} from 'luxon';
import Stars from './Stars';
import {
  faSearch as ObscurityIcon,
  faRabbitFast as SpeedIcon,
  faBook as LengthIcon,
  faThumbsUp as PositiveContrarinessIcon,
  faThumbsDown as NegativeContrarinessIcon,
  faMeh as ZeroContrarinessIcon,
  faStar as StarIcon,
  faStarHalf as HalfStarIcon,
  faEmptySet as ZeroStarIcon,
  faMinus as ZeroIcon,
  faQuestionCircle as MissingIcon,
  faCheck as FinishedIcon,
} from '@fortawesome/pro-light-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const GET_TABLE_DATA = gql`
  query readings {
    readings(orderBy: "startDate", order: "DESC") {
      rating
      ratingPercentile
      startDate
      amountPerDayPercentile
      daysToFinish
      contrariness
      contrarinessPercentile
      contrarinessAbsPercentile
      finished
      book {
        ...BookComponentFields
        estimatedLengthPercentile
        estimatedLength
        goodreadsRatingsCountPercentile
      }
    }
  }
  ${Book.fragments.book}
`;

const googleSheetsDateColumn = (id) => ({
  id,
  accessor: (row) => (row[id] ? DateTime.fromISO(row[id]) : null),
  Cell: (row) =>
    row.value ? row.value.toLocaleString(DateTime.DATE_FULL) : null,
});

export default class ReadingsTable extends React.Component {
  render() {
    return (
      <Query query={GET_TABLE_DATA}>
        {({loading, error, data}) => {
          if (loading) {
            return <div>Loading data for table.</div>;
          }
          return (
            <ReactTable
              data={data.readings}
              columns={[
                {Header: 'Title', accessor: 'book.title'},
                {
                  Header: 'Start date',
                  ...googleSheetsDateColumn('startDate'),
                },
                {
                  Header: 'Rating',
                  accessor: 'ratingPercentile',
                  Cell: (row) => (
                    <Stars
                      percentile={row.value}
                      fullIcon={StarIcon}
                      halfIcon={HalfStarIcon}
                      zeroIcon={ZeroStarIcon}
                      tooltip={row.original.rating}
                    />
                  ),
                },
                {
                  Header: 'Days to finish',
                  accessor: 'daysToFinish',
                },
                {
                  Header: 'Speed',
                  accessor: 'amountPerDayPercentile',
                  Cell: (row) => (
                    <Stars
                      percentile={row.value}
                      fullIcon={SpeedIcon}
                      zeroIcon={ZeroIcon}
                    />
                  ),
                },
                {
                  Header: 'Length',
                  accessor: 'book.estimatedLengthPercentile',
                  Cell: (row) => (
                    <Stars percentile={row.value} fullIcon={LengthIcon} />
                  ),
                },
                {
                  Header: 'Obscurity',
                  accessor: 'book.goodreadsRatingsCountPercentile',
                  Cell: (row) => (
                    <Stars percentile={1 - row.value} fullIcon={ObscurityIcon} />
                  ),
                },
                {
                  Header: 'Contrariness',
                  accessor: 'contrarinessPercentile',
                  Cell: (row) => (
                    <Stars
                      className="contrariness"
                      percentile={row.original.contrarinessAbsPercentile}
                      fullIcon={
                        row.original.contrariness > 0
                          ? PositiveContrarinessIcon
                          : NegativeContrarinessIcon
                      }
                      zeroIcon={ZeroContrarinessIcon}
                    />
                  ),
                },
                {
                  Header: 'Finished',
                  accessor: 'finished',
                  Cell: (row) =>
                    row.value === 1 ? (
                      <FontAwesomeIcon icon={FinishedIcon} />
                    ) : (
                      `${Math.round(row.value * 100)}%`
                    ),
                },
              ]}
            />
          );
        }}
      </Query>
    );
  }
}
