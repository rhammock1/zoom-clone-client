import React from 'react';

const UserContext = React.createContext({
    username: '',
    newUser: false,
    setUserName: () => {},
    startUserName: () => {},
});

export default UserContext;