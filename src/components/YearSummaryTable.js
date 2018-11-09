import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import gql from 'graphql-tag';
import Book from './book/Book';
import {Query} from 'react-apollo';
import {DateTime} from 'luxon';
import {faBook as BookIcon} from '@fortawesome/pro-light-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import _ from 'lodash';

const GET_TABLE_DATA = gql`
  query readings {
    readings(orderBy: "startDate", order: "DESC") {
      rating
      startDate
      endDate
      amountPerDay
      amountPerDayPercentile
      daysToFinish
      daysToFinishPercentile
      contrariness
      contrarinessPercentile
      contrarinessAbsPercentile
      ratingPercentile
      finished
      book {
        ...BookComponentFields
        estimatedLengthPercentile
        estimatedLength
      }
    }
  }
  ${Book.fragments.book}
`;

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
                  Header: 'Rating',
                  accessor: 'rating',
                  aggregate: (vals) =>
                    _.mean(
                      vals.filter((v) => !_.isNil(v) && !_.isNaN(v) && v > 0),
                    ),
                  Aggregated: (row) => `${row.value.toFixed(2)} average`,
                },
                {
                  Header: 'Average book length',
                  id: 'lengthAvg',
                  accessor: (row) =>
                    row.book.estimatedLength / LENGTH_NORMALIZATION_FACTOR,
                  aggregate: (vals) =>
                    _.mean(
                      vals.filter((v) => !_.isNil(v) && !_.isNaN(v) && v > 0),
                    ),
                  Aggregated: (row) => (
                    <span>
                      {row.value.toFixed(2)} <FontAwesomeIcon icon={BookIcon} />
                    </span>
                  ),
                  Cell: (row) => row.value.toFixed(2),
                },
                {
                  Header: 'Total amount read',
                  id: 'lengthTot',
                  accessor: (row) =>
                    row.book.estimatedLength / LENGTH_NORMALIZATION_FACTOR,
                  aggregate: (vals) => _.sum(vals),
                  Aggregated: (row) => (
                    <span>
                      {row.value.toFixed()} <FontAwesomeIcon icon={BookIcon} />
                    </span>
                  ),
                  Cell: (row) => row.value.toFixed(2),
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
