import React from 'react'
import { theme } from '../utils'

const GlobalContext = React.createContext({    
    theme,
    rooms: [],
    setRooms: () => {},
    unfilteredRooms: [],
    setUnfilteredRooms: () => {},
    posts: [],
    setPosts: () => {},
    news: [],
    setNews: () => {},
});

export default GlobalContext;
