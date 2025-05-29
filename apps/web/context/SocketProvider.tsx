'use client'
// contexts must be client components

import React, { useCallback, useEffect, useContext, useState } from "react";
import { io, Socket} from "socket.io-client";

interface SocketProviderProps{
    children?:React.ReactNode
}

interface InterfaceSocketContext{
    sendMessage:(msg:string)=>any;
}

const SocketContext=React.createContext<InterfaceSocketContext | null>(null);

export const useSocket=()=>{
    const state=useContext(SocketContext);
    if(!state)throw new Error('state is undefined');
    return state;
}

export const SocketProvider:React.FC<SocketProviderProps>=({children})=>{

    const [socket,setSocket]=useState<Socket>();

    const sendMessage:InterfaceSocketContext['sendMessage']=useCallback((msg)=>{
        console.log("send message",msg);
        if(socket){
            socket.emit('event:message',{message:msg})
        }
    },[socket])

    useEffect(()=>{
        const _socket=io('http://localhost:8000')
        setSocket(_socket);

        return ()=>{
            _socket.disconnect();
            setSocket(undefined);
        }
    },[])

    return(
        <SocketContext.Provider value={{sendMessage:sendMessage}}>
            {children}
        </SocketContext.Provider>
    )
}

