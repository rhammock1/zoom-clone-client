import React from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
import { Route } from 'react-router';
import Home from './Home/Home';
import Room from './Room/Room';
const ENDPOINT = "http://localhost:8080";

class App extends React.Component {

  componentDidMount() {
    let roomId;
    const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});
    socket.emit('join-room', (socket) => {
      console.log("Joined room");
    })
    socket.on('uuid', (id) => {
      roomId = id;
      console.log(roomId);
      
    })
  }

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
