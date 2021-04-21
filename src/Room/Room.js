import React from 'react';
import './Room.css';
import { Link } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Peer from 'peerjs';
import UserContext from '../UserContext';
const ENDPOINT = (process.env.NODE_ENV === 'development') ? "http://localhost:8080" : 'https://floating-dawn-41188.herokuapp.com/'; // May have to change endpoint that io is listening on
const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});
let peer, myStream;


class Room extends React.Component {

    state = {
        message: '',
        messages: [],
        muted: false,
        hideVideo: false,
    }

    static contextType = UserContext;

    messageContainer = React.createRef();

    componentDidMount() {
        const { roomId } = this.props.match.params;
        const { username } = this.context;
        
        peer = new Peer(username, {
            path: '/peerjs',
            host: process.env.REACT_APP_PEER_HOST,
            port: process.env.REACT_APP_PEER_PORT,
        })
        peer.on('open', (id) => {
            
            socket.emit('join-room', roomId, id);
            // this.handleAnswerCall(myStream);
        })

        
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        }).then((stream) => {
            myStream = stream;
            const myVideo = document.createElement('video');
            if (username !== '') {
                this.handleAddVideoStream(myVideo, stream);
            }
            this.handleAnswerCall(stream);
            
        }).catch((error) => {
            console.error(error);
        });
        if (username !== ''){
            this.scrollToBottom();
        } 
        
        
        setInterval(this.handleReceiveMessage(), 1000);
    }

    componentDidUpdate() {
        const { username } = this.context;
        if (username !== '') {
            this.scrollToBottom();
        }
    }

    scrollToBottom() {
        const scroll = this.messageContainer.current.scrollHeight - this.messageContainer.current.clientHeight;
        this.messageContainer.current.scrollTo(0, scroll);
    }

    handleAnswerCall = (stream) => {
        peer.on('call', (call) => {
            call.answer(stream);
            const video = document.createElement('video');
            call.on('stream', (userVideoStream) => {
                
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

            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            }).then((stream) => {

                const call = peer.call(userId, stream);
                const video = document.createElement('video');
                call.on('stream', (userVideoStream) => {
                    
                    this.handleAddVideoStream(video, userVideoStream);
                })

            }).catch((error) => {
                console.error(error);
            });
            
        })
        
    }

    handleMuteUnmute = () => {
        const enabled = myStream.getAudioTracks()[0].enabled;
        if (enabled) {
            myStream.getAudioTracks()[0].enabled = false;
            this.setState({ muted: true })
        } else {
            myStream.getAudioTracks()[0].enabled = true;
            this.setState({ muted: false });
        }
    }

    handlePlayStopVideo = () => {
        const enabled = myStream.getVideoTracks()[0].enabled;
        if (enabled) {
            myStream.getVideoTracks()[0].enabled = false;
            this.setState({ hideVideo: true })
        } else {
            myStream.getVideoTracks()[0].enabled = true;
            this.setState({ hideVideo: false });
        }
    }

    handleReceiveMessage = () => {
        socket.on('createMessage', (message) => {
            const { messages } = this.state;
            messages.push(message);
            this.setState({ messages });
            // this.scrollToBottom();
        })
    }

    handleMessage = (event) => {
        this.setState({ message: event.target.value })
 
    }

    handleSendMessage = (event) => {
        const { message } = this.state;
        if (event.which === 13 && message.length !== 0) {
            
            socket.emit('message', { message: message, userId: peer.id })
            event.target.value = '';
        }
    }

    setUserName = (event) => {
        event.preventDefault();
        // I dont think this part actually works, FIX IT
        peer.id = event.target.username.value;
    }

    render() {
        this.handleNewUserJoin();
        const { messages, muted, hideVideo } = this.state;
        const { username, setUserName } = this.context;

        // TODO fix so that it renders video after submitting username
        // if (username === '') {
        //     return (
        //         <form key={username} onSubmit={setUserName} >
        //             <label htmlFor='username'>What username would you like to use?</label>
        //             <input type='text' name='username' id='username' />
        //             <input type='submit' value='Confirm username'/>
        //         </form>
        //     )
        // } else {
            return (
                <>
                    <div className='main'>
                        <div className='main_left'>
                            <div className='main_videos'>
                                <div key={username} id="video_flex">
                            
                                </div>
                            </div>
                            <div className='main_controls'>
                                <div className='main_controls_block'>
                                    <div onClick={this.handleMuteUnmute}className='main_controls_button'>
                                        {(!muted)
                                            ? (<><i className="fas fa-microphone"></i>
                                            <span>Mute</span></> )
                                            : (<><i className="unmute fas fa-microphone-slash"></i>
                                            <span>Unmute</span>   </>)
                                        }                                 
                                    </div>
                                    <div onClick={this.handlePlayStopVideo} className='main_controls_button'>
                                        {(!hideVideo)
                                            ? (<><i className="fas fa-video"></i>
                                            <span>Stop Video</span></>)
                                            : (<><i className="start fas fa-video-slash"></i>
                                            <span>Start Video</span></>)
                                        }                                 
                                    </div>
                                </div>
                                <div className='main_controls_block'>
                                    <div className='main_controls_button'>
                                        <i className="fas fa-shield-alt"></i>
                                        <span>Security</span>                                    
                                    </div>
                                    <div className='main_controls_button'>
                                        <i className="fas fa-user-friends"></i>
                                        <span>Participants</span>                                    
                                    </div>
                                    <div className='main_controls_button'>
                                        <i className="fas fa-comment-alt"></i>
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
                            <div ref={this.messageContainer} className='main_chat_window'>
                                <ul className='messages'>
                                    {messages.map((msg, index) => {
                                        return (
                                        <li key={index} className='message'><b>{msg.userId}</b><br />{msg.message}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className='main_message_container'>
                                <input onKeyDown={this.handleSendMessage} onChange={this.handleMessage} id='chat_message' name='chat_message' type='text' placeholder='Type message here...' />
                            </div>
                        </div>
                    </div>
                    
                </>
            )
        // }
        
    }
}

export default Room;