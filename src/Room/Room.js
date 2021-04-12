import React from 'react';
import '../Video/Video.css';
import { Link } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Peer from 'peerjs';
const ENDPOINT = "http://localhost:8081"; // Mayt have to change endpoint that io is listening on
const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});
let peer;
let myStream;



// const Video = () => {
//     const videoRef = useRef(null);

//     useEffect(() => {
//       getVideo();
//     }, [videoRef]);

//     const getVideo = () => {
//         navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: true,
//         }).then((stream) => {
//             let video = videoRef.current;
            
//             myStream = stream;
            
//         }).catch((error) => {
//             console.error(error);
//         });
    
//     const addVideoStream = function(video, stream) {
//         const videoFlex = document.getElementById('video-flex');
//         video.srcObject = stream;
//         video.play();
//         video.muted = true; //muted for testing
//     }
//     };

//     return (
//         <div id="video-flex">
//             {/* <video ref={videoRef} /> */}
//         </div>
//     );

// };

class Room extends React.Component {

    componentDidMount() {
        const { roomId } = this.props.match.params;
        peer = new Peer('', {
            path: '/peerjs',
            host: process.env.REACT_APP_PEER_HOST,
            port: 8082,
        })
        peer.on('open', (id) => {
            console.log('peer connected');
            socket.emit('join-room', roomId, id);
        })

        const myVideo = document.createElement('video');
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        }).then((stream) => {
            myStream = stream;
            this.handleAddVideoStream(myVideo, stream);

            peer.on('call', (call) => {
                call.answer(stream);
                const video = document.createElement('video');
                call.on('stream', (userVideoStream) => {
                    this.handleAddVideoStream(video, userVideoStream);
                })
            })
        }).catch((error) => {
            console.error(error);
        });
        
        // socket.emit('uuid', roomId);
    }

    handleGetVideo = () => {

    }

    handleAddVideoStream = (video, stream) => {
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
        console.log("this is a new user", userId);
        const call = peer.call(userId, stream);
        const video = document.createElement('video');
        call.on('stream', (userVideoStream) => {
            this.handleAddVideoStream(video, userVideoStream);
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