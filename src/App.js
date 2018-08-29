import React, {Component} from 'react';
import AmountPerDayChart from './components/AmountPerDayChart';
import {Container} from 'reactstrap';
import './App.css';
import {
  RecentBooks,
  InProgressBooks,
  MostContrarianBooks,
  LeastContrarianBooks,
} from './components/book/BookGroups';

class App extends Component {
  render() {
    return (
      <Container className="app">
        <h1>Recently finished</h1>
        <RecentBooks variables={{count: 3}} />
        <h1>In progress</h1>
        <InProgressBooks variables={{count: 3}} />
        <h1>Most contrarian</h1>
        <MostContrarianBooks variables={{count: 3}} />
        <h1>Least contrarian</h1>
        <LeastContrarianBooks variables={{count: 3}} />
        <h1>Reading speed over time</h1>
        <AmountPerDayChart />
        <hr />
        <div className="text-center">
          This application was created by Eric McKay. The source code is
          available on GitHub.{' '}
          <a href="https://github.com/emckay/books-back-end">
            Back-end GraphQL server
          </a>{' '}
          -{' '}
          <a href="https://github.com/emckay/books-front-end">
            Front-end ReactJS app
          </a>
        </div>
      </Container>
    );
  }
}

export default App;
