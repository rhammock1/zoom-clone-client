import React from 'react';
import { Link } from 'react-router-dom';
import uuid from 'uuid';

const handleNewRoom = () => {
    // Link to a new room with a unique id
    console.log("Time to start a new room boss")
}

const handleJoinRoom = () => {
    // add text input to render so user can input id of room to join
    console.log("Time to join a new room boss")
}

const Home = () => {
    return (
      <div className='button-container'>
        <button onClick={handleJoinRoom} type="button">Join a room</button>
        <Link to={`/${uuid()}`} onClick={handleNewRoom} type="button">Start a room</Link>
      </div>
    )
}

export default Home;