import React from 'react';

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
        <button onClick={handleNewRoom} type="button">Start a room</button>
      </div>
    )
}

export default Home;