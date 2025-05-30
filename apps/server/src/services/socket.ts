import { Server } from "socket.io";
import Redis from "ioredis";
import dotenv from 'dotenv';
import prismaClient from "./prisma";
dotenv.config();

const redisConfig={
    host:process.env.AIVEN_VALKEY_HOST,
    port:Number(process.env.AIVEN_VALKEY_PORT),
    username:'default',
    password:process.env.AIVEN_VALKEY_PASSWORD,
    tls:{}
}

const pub=new Redis(redisConfig);
const sub=new Redis(redisConfig);

export default class SocketService{
    private _io:Server;

    constructor(){
        this._io=new Server({
            cors:{
                allowedHeaders:['*'],
                origin:'*'
            }
        });
        sub.subscribe('MESSAGES');
        console.log("init socket server");
    }

    public initListeners(){
        const io=this._io;
        console.log('init socket listeners');
        io.on('connect',socket=>{
            console.log('new socket connected',socket.id);

            socket.on('event:message',async ({message}:{message:string})=>{
                console.log('new message recieved',message);

                // publish message to publisher
                await pub.publish('MESSAGES',JSON.stringify({message:message}))
            })
        })

        sub.on('message',async(channel,message)=>{
            if(channel==='MESSAGES'){
                console.log('message from redis',message);
                io.emit('message',message);

                await prismaClient.message.create({
                    data:{
                        text:message
                    }
                })
            }
        })

    }

    get io(){
        return this._io;
    }
}