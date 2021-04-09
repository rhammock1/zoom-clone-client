import React from 'react';
import { Link } from 'react-router-dom';
import Video from '../Video/Video';

const Room = () => {
    return (
        <>
            <Video />
            <Link to='/'>Back to Home</Link>
        </>
    )
}

export default Room;