import React, { useEffect, useRef } from 'react';

// const myVideo = document.getElementsByTagName('video');
// const videoGrid = document.getElementById('video-grid');

// myVideo.muted = true; // set true for testing purposes

// let videoStream;

const Video = () => {
    const videoRef = useRef(null);

    useEffect(() => {
      getVideo();
    }, [videoRef]);

    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        }).then((stream) => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div>
            <video ref={videoRef} />
        </div>
    );

};

export default Video;