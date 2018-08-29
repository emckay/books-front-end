import React, {PureComponent} from 'react';
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryZoomContainer,
} from 'victory';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Row, Col, Card, ListGroup, ListGroupItem} from 'reactstrap';
import IsbnBook from './book/IsbnBook';

const AMOUNT_PER_DAY_QUERY = gql`
  {
    readings {
      startDate
      endDate
      rating
      amountPerDay
      ratingPercentile
      audio
      book {
        isbn
      }
    }
  }
`;

const amountReadPerDay = (data, zoomDomain) => {
  const ret = data
    .filter(
      (reading) =>
        reading.startDate &&
        reading.endDate &&
        reading.amountPerDay &&
        (zoomDomain
          ? new Date(reading.endDate) > zoomDomain.x[0] &&
            new Date(reading.startDate) < zoomDomain.x[1]
          : true)
    )
    .map((reading) => (
      <VictoryLine
        key={`${reading.book.isbn}-${reading.startDate}`}
        data={[
          {
            x: new Date(reading.startDate),
            y: reading.amountPerDay,
            title: reading.title,
            isbn: reading.book.isbn,
            strokeWidth: reading.audio ? 8 : 4,
          },
          {
            x: new Date(reading.endDate),
            y: reading.amountPerDay,
          },
        ]}
        style={{
          data: {
            stroke: d3ScaleChromatic.interpolateRdYlGn(
              reading.ratingPercentile
            ),
            strokeWidth: (data) => {
              return data[0].strokeWidth;
            },
          },
        }}
      />
    ));
  return ret;
};

class AmountPerDayChart extends PureComponent {
  state = {
    zoomDomain: {
      x: [
        new Date().getTime() - 365 * 24 * 60 * 60 * 1000,
        new Date().getTime(),
      ],
    },
    xDomain: null,
    yDomain: null,
    clickedBookIsbn: null,
    selectedBookIsbn: null,
  };

  static getDerivedStateFromProps(props) {
    const xDomain = [
      Math.min(
        ...props.readings.filter((x) => x.startdate).map((x) => x.startdate)
      ),
      Math.max(
        ...props.readings.filter((x) => x.enddate).map((x) => x.enddate)
      ),
    ];
    const yDomain = [
      Math.min(
        ...props.readings
          .filter((x) => x.amountPerDay && isFinite(x.amountPerDay))
          .map((x) => x.amountPerDay)
      ),
      Math.max(
        ...props.readings
          .filter((x) => x.amountPerDay && isFinite(x.amountPerDay))
          .map((x) => x.amountPerDay)
      ),
    ];
    return {xDomain, yDomain};
  }

  handleZoom = (domain) => {
    this.setState({zoomDomain: domain});
  };

  handleClick = (event, clicked) => {
    if (this.state.clickedBookIsbn === clicked.data[0].isbn) {
      // De-select if this one has already been clicked.
      this.setState({clickedBookIsbn: null});
      this.setState({selectedBookIsbn: null});
    } else {
      this.setState({clickedBookIsbn: clicked.data[0].isbn});
      this.setState({selectedBookIsbn: clicked.data[0].isbn});
    }
  };

  render() {
    return (
      <Row className="d-flex align-items-center justify-content-center">
        <Col>
          <div style={{height: '500px', width: '800px', margin: '0 auto'}}>
            <VictoryChart
              scale={{x: 'time'}}
              theme={VictoryTheme.material}
              domain={this.state.xDomain ? {x: this.state.xDomain} : undefined}
              height={500}
              width={800}
              padding={{top: 10, left: 60, right: 0, bottom: 30}}
              containerComponent={
                <VictoryZoomContainer
                  zoomDomain={this.state.zoomDomain}
                  onZoomDomainChange={this.handleZoom}
                  zoomDimension="x"
                  allowZoom={false}
                  minimumZoom={{x: 30 * 24 * 60 * 60 * 1000}}
                />
              }
              events={[
                {
                  target: 'data',
                  childName: 'all',
                  eventHandlers: {
                    onClick: this.handleClick,
                    onMouseEnter: (event, props) => {
                      this.setState({selectedBookIsbn: props.data[0].isbn});
                      return [
                        {
                          mutation: (props) => ({
                            style: {...props.style, strokeWidth: 20},
                          }),
                        },
                      ];
                    },
                    onMouseLeave: () => {
                      this.setState({selectedBookIsbn: this.state.clickedBookIsbn});
                      return [
                        {
                          mutation: (props) => {
                            return [{
                              style: {
                                ...props.style,
                                strokeWidth: props.data[0].strokeWidth,
                              },
                            }];
                          },
                        },
                      ];
                    },
                  },
                },
              ]}>
              {amountReadPerDay(this.props.readings, this.state.zoomDomain)}
            </VictoryChart>
          </div>
        </Col>
        <Col className="d-flex justify-content-center">
          {this.state.selectedBookIsbn ? (
            <IsbnBook className="w-100" isbn={this.state.selectedBookIsbn} />
          ) : (
            <Card style={{maxWidth: '280px'}}>
              <ListGroup flush>
                <ListGroupItem>
                  <dl className="row mb-0">
                    <dt className="col-4">Length</dt>
                    <dd className="col-8">Number of days</dd>
                    <dt className="col-4">Y-axis</dt>
                    <dd className="col-8">Amount read per day</dd>
                    <dt className="col-4">Color</dt>
                    <dd className="col-8">Rating</dd>
                    <dt className="col-4">Thick</dt>
                    <dd className="col-8">Audiobook</dd>
                    <dt className="col-4 mb-0">Thin</dt>
                    <dd className="col-8 mb-0">E-book</dd>
                  </dl>
                </ListGroupItem>
                <ListGroupItem>
                  Click line to see info about book.
                </ListGroupItem>
              </ListGroup>
            </Card>
          )}
        </Col>
      </Row>
    );
  }
}

const ConnectedAmountPerDayChart = (props) => (
  <Query query={AMOUNT_PER_DAY_QUERY}>
    {({loading, error, data}) => {
      if (loading) return <div>Loading data for chart</div>;
      if (error) return <div>Error fetching data for chart. {error}</div>;
      return <AmountPerDayChart readings={data.readings} {...props} />;
    }}
  </Query>
);
export default ConnectedAmountPerDayChart;
