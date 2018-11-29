import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import gql from 'graphql-tag';
import Book from './book/Book';
import {Query} from 'react-apollo';
import {DateTime} from 'luxon';
import {
  faBook as LengthIcon,
  faQuestion as MissingIcon,
  faHeadphones as AudiobookIcon,
  faBookOpen as BookIcon,
} from '@fortawesome/pro-light-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import _ from 'lodash';

const GET_TABLE_DATA = gql`
  query readings {
    readings(orderBy: "startDate", order: "DESC") {
      rating
      startDate
      ratingPercentile
      finished
      audio
      book {
        ...BookComponentFields
        estimatedLength
      }
    }
  }
  ${Book.fragments.book}
`;

const RoundedLength = ({value, digits=2}) => <span>
      {value.toFixed(digits)} <FontAwesomeIcon icon={LengthIcon} />
      </span>

const roundedBookLengthCell = (key, digits = 2, {includeMissing = false} = {}) => ({
  value,
  subRows,
}) =>
  value ? (
    <span>
      <RoundedLength value={value} />
      {includeMissing &&
        ` (${subRows.map((r) => r[key]).filter(_.isNil).length} missing)`}
    </span>
  ) : (
    <FontAwesomeIcon icon={MissingIcon} />
  );

const LENGTH_NORMALIZATION_FACTOR = 5000;
window.DateTime = DateTime;
export default class YearSummaryTable extends React.Component {
  render() {
    return (
      <Query query={GET_TABLE_DATA}>
        {({loading, error, data}) => {
          if (loading) {
            return <div>Loading data for table.</div>;
          }
          const nonMissingData = data.readings.filter((row) => row.startDate);
          return (
            <ReactTable
              data={nonMissingData}
              showPagination={false}
              defaultPageSize={
                _.uniq(
                  nonMissingData.map(
                    (row) => DateTime.fromISO(row.startDate).year,
                  ),
                ).length
              }
              columns={[
                {
                  Header: 'Year',
                  id: 'year',
                  accessor: (row) => DateTime.fromISO(row.startDate).year,
                  PivotValue: (row) => row.value,
                },
                {
                  Header: 'Title',
                  accessor: 'book.title',
                  aggregate: (vals) => vals.length,
                  Aggregated: (row) => `${row.value} total`,
                },
                {
                  Header: 'Audio',
                  accessor: 'audio',
                  aggregate: (vals, rows) => ({
                    count: vals.filter((v) => v).length,
                    length: rows
                      .filter((v) => v.audio)
                      .reduce(
                        (totLen, row) =>
                          totLen + (row._original.book.estimatedLength
                            ? row._original.book.estimatedLength
                            : 0),
                        0,
                      ) / LENGTH_NORMALIZATION_FACTOR,
                  }),
                  Aggregated: (row) => (
                    <span>
                      <FontAwesomeIcon icon={AudiobookIcon} /> {row.value.count}{' '}
                      (<RoundedLength value={row.value.length} />)
                    </span>
                  ),
                  Cell: (row) =>
                    row.value ? <FontAwesomeIcon icon={AudiobookIcon} /> : null,
                },
                {
                  Header: 'Book',
                  id: 'book',
                  accessor: (row) => !row.audio,
                  aggregate: (vals, rows) => ({
                    count: vals.filter((v) => v).length,
                    length: rows
                      .filter((v) => !v.audio)
                      .reduce(
                        (totLen, row) =>
                          totLen + (row._original.book.estimatedLength
                            ? row._original.book.estimatedLength
                            : 0),
                        0,
                      ) / LENGTH_NORMALIZATION_FACTOR,
                  }),
                  Aggregated: (row) => (
                    <span>
                      <FontAwesomeIcon icon={BookIcon} /> {row.value.count}{' '}
                      (<RoundedLength value={row.value.length} />)
                    </span>
                  ),
                  Cell: (row) =>
                    row.value ? <FontAwesomeIcon icon={BookIcon} /> : null,
                },
                {
                  Header: 'Rating',
                  accessor: 'rating',
                  aggregate: (vals) =>
                    _.mean(vals.filter((v) => !_.isNil(v) && !_.isNaN(v))),
                  Aggregated: (row) => `${row.value.toFixed(2)} average`,
                },
                {
                  Header: 'Average book length',
                  id: 'lengthAvg',
                  accessor: (row) =>
                    !_.isNil(row.book.estimatedLength)
                      ? row.book.estimatedLength / LENGTH_NORMALIZATION_FACTOR
                      : null,
                  aggregate: (vals) =>
                    _.mean(vals.filter((v) => !_.isNil(v) && !_.isNaN(v))),
                  Aggregated: roundedBookLengthCell('lengthAvg', 2),
                  Cell: roundedBookLengthCell('lengthAvg', 2),
                },
                {
                  Header: 'Total amount read',
                  id: 'lengthTot',
                  accessor: (row) =>
                    !_.isNil(row.book.estimatedLength)
                      ? row.book.estimatedLength / LENGTH_NORMALIZATION_FACTOR
                      : null,
                  aggregate: (vals) => _.sum(vals),
                  Aggregated: roundedBookLengthCell('lengthTot', 2, {
                    includeMissing: true,
                  }),
                  Cell: roundedBookLengthCell('lengthTot', 2),
                },
              ]}
              pivotBy={['year']}
            />
          );
        }}
      </Query>
    );
  }
}
