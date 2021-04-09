import React from 'react';
import './App.css';
import { Route } from 'react-router';
import Home from './Home/Home';
import Room from './Room/Room';

class App extends React.Component {

  render() {
    return (
      <>
        <h1>Hello Zoom Clone</h1>
        <Route exact path='/' component={Home} />
        <Route path='/:roomId' component={Room} />
      </>
    )
  }
}

export default App;
