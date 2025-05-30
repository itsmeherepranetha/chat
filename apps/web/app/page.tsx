'use client'
import { useState } from 'react';
import { useSocket } from '../context/SocketProvider'
import classes from './page.module.css'

export default function Page(){

  const {sendMessage,messages}=useSocket();
  const [message,setMessage]=useState("");

  return (
    <div>
      <div>
        <input onChange={e=>setMessage(e.target.value)} className={classes["chat-input"]} type="text" placeholder="Type your message..."/>
        <button className={classes['button']} onClick={()=>sendMessage(message)}>Send</button>
      </div>
      <div>
        {messages.map(msg=><li>{msg}</li>)}
      </div>
    </div>
  )
}