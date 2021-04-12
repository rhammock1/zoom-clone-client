import React from 'react';
import './Room.css';
import { Link } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Peer from 'peerjs';
const ENDPOINT = (process.env.NODE_ENV === 'development') ? "http://localhost:8080" : 'https://floating-dawn-41188.herokuapp.com/'; // May have to change endpoint that io is listening on
const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});
let peer;
let myStream;

class Room extends React.Component {

    constructor(props) {
        super(props);
        peer = new Peer('', {
            path: '/peerjs',
            host: process.env.REACT_APP_PEER_HOST,
            port: process.env.REACT_APP_PEER_PORT,
        })
    }

    componentDidMount() {
        const { roomId } = this.props.match.params;
        
        peer.on('open', (id) => {
            console.log('peer connected');
            socket.emit('join-room', roomId, id);
            this.handleAnswerPeer(myStream);
        })

        const myVideo = document.createElement('video');
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        }).then((stream) => {
            myStream = stream;
            console.log(stream);
            this.handleAddVideoStream(myVideo, stream);

            // answers the call from a peer that connects
            // this.handleAnswerPeer(stream);

        }).catch((error) => {
            console.error(error);
        });
        
        // socket.emit('uuid', roomId);
    }

    handleAnswerPeer = (stream) => {
        peer.on('call', (call) => {
            call.answer(stream);
            console.log('call', call)
            const video = document.createElement('video');
            call.on('stream', (userVideoStream) => {
                this.handleAddVideoStream(video, userVideoStream);
                console.log('inside answer peer');
            })
        })
    }

    handleAddVideoStream = (video, stream) => {
        // handles adding video streams to the DOM
        const videoFlex = document.getElementById('video-flex');
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
            video.muted = true; // muted for testing purposes
        })
        videoFlex.append(video);
    }

    handleNewUserJoin = () => {
        socket.on('user-connected', (userId) => {
            console.log('a new user has joined');
            this.handleConnectNewUser(userId, myStream);
            
        })
        
    }

    handleConnectNewUser = (userId, stream) => {
        // Sends the user we are connecting to my id and stream
        
        console.log("this is a new user", userId);
        const call = peer.call(userId, stream);
        const video = document.createElement('video');
        console.log('call', call)
        // This is the new peers stream
        call.on('stream', (userVideoStream) => { // this is currently never being called
            this.handleAddVideoStream(video, userVideoStream);
            console.log('inside connect new user');
        })
        call.on('close', () => {
            video.remove()
        })
        
    }


    render() {
        this.handleNewUserJoin();

        return (
            <>
                <div id="video-flex">
                    
                </div>
                <Link to='/'>Back to Home</Link>
            </>
        )
    }
}

export default Room;