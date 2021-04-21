import React from 'react';
import { Link } from 'react-router-dom';
import uuid from 'uuid';
import UserContext from '../UserContext';
import './Home.css';

class Home extends React.Component {

    state = {
        join: false,
        hasRoom: null,
        error: null,
    }

    static contextType = UserContext;

    handleJoinRoom = async (event) => {
        event.preventDefault();
        const { roomId } = event.target;
        if (roomId.value === '') {
            return;
        }
        await this.handleRoomIdCheck(roomId.value)
        
        const { hasRoom } = this.state;
        if(hasRoom) {
            this.props.history.push(`/${roomId.value}`);
        } else {
            event.target.roomId.value = '';
        }
        
    }

    handleRoomIdCheck = async (id) => {
        const ENDPOINT = (process.env.NODE_ENV === 'development') ? "http://localhost:8080" : 'https://floating-dawn-41188.herokuapp.com/';
        await fetch(`${ENDPOINT}/rooms`, {
            headers: {
                room_id: id,
            }
        }).then((res) => {
            if (!res) {
                return res.json().then((error) => this.setState(error));
            } else {
                return res.json();
            }
        }).then((resJson) => {
            if (resJson) {
                this.setState({ hasRoom: true });
                                
            } else {
                this.setState({ hasRoom: false });
                
            }
        }).catch((error) => {
            this.setState(error)
        });
            
    }

    handleRoomId = () => {
        // add text input to render so user can input id of room to join
        this.setState({ join: true });
    }

    render() {
        const { join, hasRoom } = this.state;
        const { setUserName, startUserName, username, newUser } = this.context;

        return (
            <>
                <h1>Zoom Clone</h1>
                <div className='button-container'>
                
                    {(!join) 
                        ? <button className='big_button blue' onClick={this.handleRoomId} type="button">Join a Meeting</button>
                        : (
                            <>
                                <form onSubmit={this.handleJoinRoom}>
                                    <input placeholder='Room ID' id='roomId' name='roomId' type='text' />
                                    <button className='submit_button' type='submit'>Submit</button>
                                </form>
                                
                            </>
                        )}
                    {(hasRoom === false) ? <p>Sorry that Room Id is not valid</p> : null}
                    {(username !== '')
                        ? <Link className='big_button' to={`/${uuid()}`}>
                            <button className='big_button' type='button'>Start room</button>
                        </Link>
                        : (!newUser) 
                            ? <button className='big_button' onClick={startUserName} type='button'>Sign In</button>
                            : (
                                <form onSubmit={setUserName} >
                                    <input placeholder='Please Choose a Username' type='text' name='username' id='username' />
                                    <button className='submit_button' type='submit'>Confirm Username</button>
                                </form>
                        )}
                </div>
            </>
          )
    }
}

export default Home;