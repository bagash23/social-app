import React, { useState } from "react";
import Context from './Context';
import { theme } from '../utils';

export default function ContextWrapper(props) {
    const [rooms, setRooms] = useState([]);
    const [unfilteredRooms, setUnfilteredRooms] = useState([]);    
    const [posts, setPosts] = useState([]);
    const [news, setNews] = useState([]);
    return <Context.Provider value={{theme, rooms, setRooms, setUnfilteredRooms, unfilteredRooms, posts, setPosts, news, setNews }} >{props.children}</Context.Provider>
}