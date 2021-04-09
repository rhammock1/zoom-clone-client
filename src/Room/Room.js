import React from 'react';
import { Link } from 'react-router-dom';
import Video from '../Video/Video';
import socketIOClient from 'socket.io-client';
const ENDPOINT = "http://localhost:8080";
const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});

class Room extends React.Component {

    componentDidMount() {
        const { roomId } = this.props.match.params;
        
        socket.emit('join-room', (socket) => {
          console.log("Joined room");
        })
        socket.emit('uuid', roomId);
    }

    handleNewUserJoin = () => {
        socket.on('user-connected', () => {
            console.log('a new user has joined');
        })
    }


    render() {
        this.handleNewUserJoin();
        
        return (
            <>
                <Video />
                <Link to='/'>Back to Home</Link>
            </>
        )
    }
}

export default Room;