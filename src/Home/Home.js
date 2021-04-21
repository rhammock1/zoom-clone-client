import React from 'react';
import { Link } from 'react-router-dom';
import uuid from 'uuid';
import UserContext from '../UserContext';

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
                        ? <button className='big_button' onClick={this.handleRoomId} type="button">Join a Meeting</button>
                        : (
                            <>
                                <form onSubmit={this.handleJoinRoom}>
                                    <label htmlFor='roomId'>Room ID: </label>
                                    <input id='roomId' name='roomId' type='text' />
                                    <button type='submit'>Submit</button>
                                </form>
                                
                            </>
                        )}
                    {(hasRoom === false) ? <p>Sorry that Room Id is not valid</p> : null}
                    {(username !== '')
                        ? <Link to={`/${uuid()}`}>
                            <button className='big_button' type='button'>Start room</button>
                        </Link>
                        : (!newUser) 
                            ? <button onClick={startUserName} type='button'>Sign In</button>
                            : (
                                <form onSubmit={setUserName} >
                                    <label htmlFor='username'>What username would you like to use?</label>
                                    <input type='text' name='username' id='username' />
                                    <input type='submit' value='Confirm username'/>
                                </form>
                        )}
                </div>
            </>
          )
    }
}

export default Home;