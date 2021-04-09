import React from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
import Video from './Video';
const ENDPOINT = "http://localhost:8080";

class App extends React.Component {

  // componentDidMount() {
  //   const socket = socketIOClient(ENDPOINT);
  //   socket.on('join-room', (socket) => {
  //     console.log("Joined room");
  //   })
  // }

  render() {
    return (
      <>
        <h1>Hello World</h1>
        <Video />
      </>
    )
  }
}

export default App;
