import React, {Component} from 'react';
import './Book.css';
import gql from 'graphql-tag';
import {
  Row,
  Col,
  Card,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
} from 'reactstrap';
import moment from 'moment';
import Stars from '../Stars';
import classnames from 'classnames';
import {
  faThumbsUp as PositiveContrarinessIcon,
  faThumbsDown as NegativeContrarinessIcon,
  faMeh as ZeroContrarinessIcon,
  faStar as StarIcon,
  faStarHalf as HalfStarIcon,
  faEmptySet as ZeroStarIcon,
} from '@fortawesome/pro-light-svg-icons';

export default class Book extends Component {
  render() {
    const {book} = this.props;
    const reading = book.readings[book.readings.length - 1];
    const className = classnames('book', this.props.className);
    return (
      <Card className={className}>
        <ListGroup flush>
          <ListGroupItem>
            <ListGroupItemHeading className="title">{book.title}</ListGroupItemHeading>
            {book.authors.map((b) => b.name).join(', ')}
          </ListGroupItem>
          {reading.endDate && (
            <ListGroupItem>
              <div className="card-label">Finished</div>
              <div className="card-value">
                {moment(new Date(reading.endDate)).format('MMM DD, YYYY')}
              </div>
            </ListGroupItem>
          )}
          <ListGroupItem>
            <Row>
              <Col xs={6}>
                <div className="card-label">My ranking</div>
                {reading.rating !== null && reading.rating !== undefined ? (
                  <Stars
                    percentile={reading.ratingPercentile}
                    fullIcon={StarIcon}
                    halfIcon={HalfStarIcon}
                    zeroIcon={ZeroStarIcon}
                  />
                ) : (
                  <span>Unranked</span>
                )}
              </Col>
              <Col xs={6}>
                <div className="card-label">Goodreads rating</div>
                <Stars
                  className="goodreads"
                  count={book.goodreadsRatingsAvg}
                  fullIcon={StarIcon}
                  halfIcon={HalfStarIcon}
                />
              </Col>
            </Row>
          </ListGroupItem>
          {reading.contrariness !== undefined &&
            reading.contrariness !== null && (
              <ListGroupItem>
                <div className="card-label">Contrariness</div>
                <Stars
                  className="contrariness"
                  percentile={reading.contrarinessAbsPercentile}
                  fullIcon={
                    reading.contrariness > 0
                      ? PositiveContrarinessIcon
                      : NegativeContrarinessIcon
                  }
                  zeroIcon={ZeroContrarinessIcon}
                />
              </ListGroupItem>
            )}
        </ListGroup>
      </Card>
    );
  }
}
Book.fragments = {
  book: gql`
    fragment BookComponentFields on Book {
      title
      goodreadsRatingsAvg
      goodreadsRatingsCount
      authors {
        name
      }
      readings {
        endDate
        rating
        ratingPercentile
        contrariness
        contrarinessAbsPercentile
      }
    }
  `,
};
