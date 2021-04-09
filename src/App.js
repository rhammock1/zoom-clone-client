import React from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
import Video from './Video/Video';
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
        <Video />
        
      </>
    )
  }
}

export default App;
