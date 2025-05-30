'use client'
// contexts must be client components

import React, { useCallback, useEffect, useContext, useState } from "react";
import { io, Socket} from "socket.io-client";

interface SocketProviderProps{
    children?:React.ReactNode
}

interface InterfaceSocketContext{
    sendMessage:(msg:string)=>any;
    messages:string[];
}

const SocketContext=React.createContext<InterfaceSocketContext | null>(null);

export const useSocket=()=>{
    const state=useContext(SocketContext);
    if(!state)throw new Error('state is undefined');
    return state;
}

export const SocketProvider:React.FC<SocketProviderProps>=({children})=>{

    const [socket,setSocket]=useState<Socket>();
    const [messages,setMessages]=useState<string[]>([])

    const sendMessage:InterfaceSocketContext['sendMessage']=useCallback((msg)=>{
        console.log("send message",msg);
        if(socket){
            socket.emit('event:message',{message:msg})
        }
    },[socket])

    const onMessageRecieved=useCallback((msg:string)=>{
        console.log('message recieved from server',msg);
        const {message}=JSON.parse(msg) as {message:string};
        setMessages(prev=>[...prev,message])
    },[])

    useEffect(()=>{
        const _socket=io('http://localhost:8000');
        
        _socket.on('message',onMessageRecieved);

        setSocket(_socket);

        return ()=>{
            _socket.off('message',onMessageRecieved);
            _socket.disconnect();
            setSocket(undefined);
        }
    },[])

    return(
        <SocketContext.Provider value={{sendMessage:sendMessage,messages:messages}}>
            {children}
        </SocketContext.Provider>
    )
}

