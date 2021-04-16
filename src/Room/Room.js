import React from 'react';
import './Room.css';
import { Link } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Peer from 'peerjs';
const ENDPOINT = (process.env.NODE_ENV === 'development') ? "http://localhost:8080" : 'https://floating-dawn-41188.herokuapp.com/'; // May have to change endpoint that io is listening on
const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});
let peer;

class Room extends React.Component {

    state = {
        connected: 0,
        users: [],
    }

    componentDidMount() {
        const { roomId } = this.props.match.params;
        peer = new Peer('', {
            path: '/peerjs',
            host: process.env.REACT_APP_PEER_HOST,
            port: process.env.REACT_APP_PEER_PORT,
        })
        peer.on('open', (id) => {
            console.log('peer connected');
            socket.emit('join-room', roomId, id);
            // this.handleAnswerCall(myStream);
        })

        const myVideo = document.createElement('video');
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        }).then((stream) => {
            this.handleAddVideoStream(myVideo, stream);
            this.handleAnswerCall(stream);
            
        }).catch((error) => {
            console.error(error);
        });
        
    }

    handleAnswerCall = (stream) => {
        peer.on('call', (call) => {
            call.answer(stream);
            const video = document.createElement('video');
            call.on('stream', (userVideoStream) => {
                console.log('Inside Answer Call on stream')
                this.handleAddVideoStream(video, userVideoStream);
            })
        })
    }

    handleAddVideoStream = (video, stream) => {
        const videoFlex = document.getElementById('video_flex');
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

            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            }).then((stream) => {

                const call = peer.call(userId, stream);
                const video = document.createElement('video');
                call.on('stream', (userVideoStream) => {
                    console.log('line 88 in call on stream',userVideoStream);
                    this.handleAddVideoStream(video, userVideoStream);
                })

            }).catch((error) => {
                console.error(error);
            });
            
        })
    }

    render() {
        const { connected } = this.state;
        this.handleNewUserJoin();

        return (
            <>
                

                <div className='main'>
                    <div className='main_left'>
                        <div className='main_videos'>
                            <div id="video_flex">
                        
                            </div>
                        </div>
                        <div className='main_controls'>
                            <div className='main_controls_block'>
                                <div className='main_controls_button'>
                                    <i class="fas fa-microphone"></i>
                                    <span>Mute</span>                                    
                                </div>
                                <div className='main_controls_button'>
                                    <i class="fas fa-video"></i>
                                    <span>Stop Video</span>                                    
                                </div>
                            </div>
                            <div className='main_controls_block'>
                                <div className='main_controls_button'>
                                    <i class="fas fa-shield-alt"></i>
                                    <span>Security</span>                                    
                                </div>
                                <div className='main_controls_button'>
                                    <i class="fas fa-user-friends"></i>
                                    <span>Participants</span>                                    
                                </div>
                                <div className='main_controls_button'>
                                    <i class="fas fa-comment-alt"></i>
                                    <span>Chat</span>                                    
                                </div>
                            </div>
                            <div className='main_controls_block'>
                                <div className='main_controls_button'>
                                    <Link to='/'><span className='leave_meeting'>Leave Meeting</span></Link>                                  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='main_right'>
                        <div className='main_header'>
                            <h3>Chat</h3>
                        </div>

                    </div>
                </div>
                <p>There are {connected} number of peers connected</p>
                <Link to='/'>Back to Home</Link>
            </>
        )
    }
}

export default Room;