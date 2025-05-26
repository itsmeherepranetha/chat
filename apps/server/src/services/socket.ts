import { Server } from "socket.io";

export default class SocketService{
    private _io:Server;

    constructor(){
        this._io=new Server();
        console.log("init socket server");
    }

    public initListeners(){
        const io=this._io;
        console.log('init socket listeners');
        io.on('connect',socket=>{
            console.log('new socket connected',socket.id);

            socket.on('event:message',async ({message}:{message:string})=>{
                console.log('new message recieved',message);
            })
        })
    }

    get io(){
        return this._io;
    }
}