import React from 'react';
import './App.css';
import { Route } from 'react-router';
import Home from './Home/Home';
import Room from './Room/Room';
import UserContext from './UserContext';

class App extends React.Component {

  state = {
    username: '',
    newUser: false,
  }
  
  static contextType = UserContext;

  setUserName = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    this.setState({ username, newUser: false });
    event.target.username.value = '';
  }

  startUserName = () => {
    this.setState({ newUser: true });
  }
  
  render() {
    const { username, newUser } = this.state;
    const value = {
      username,
      newUser,
      setUserName: this.setUserName,
      startUserName: this.startUserName,
    }

    return (
      <UserContext.Provider value={value}>
        
        <Route exact path='/' component={Home} />
        <Route path='/:roomId' component={Room} />
      </UserContext.Provider>
    )
  }
}

export default App;
