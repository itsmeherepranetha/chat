'use client'
// contexts must be client components

import React from "react";

interface SocketProviderProps{
    children?:React.ReactNode
}

const SocketContext=React.createContext(null);


export const SocketProvider:React.FC<SocketProviderProps>=({children})=>{
    return(
        <SocketContext.Provider value={null}>
            {children}
        </SocketContext.Provider>
    )
}

