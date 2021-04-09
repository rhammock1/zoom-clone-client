import React, { useEffect, useRef } from 'react';
import './Video.css';


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
            video.muted = true; //muted for testing
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div id="video-flex">
            <video ref={videoRef} />
        </div>
    );

};

export default Video;