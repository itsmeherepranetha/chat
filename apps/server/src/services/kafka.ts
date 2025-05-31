import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import prismaClient from "./prisma";
dotenv.config();

const kafka=new Kafka({
    brokers:(process.env.KAFKA_SERVICE_URI || "")?.split(','),
    ssl:{
        ca:[fs.readFileSync(path.resolve('./ca.pem'),'utf-8')] // ca.pem must be kept in the server folder
    },
    sasl:{
        username:process.env.KAFKA_USERNAME as string,
        password:process.env.KAFKA_PASSWORD as string, 
        mechanism:'plain'
    }
})

let producer:Producer|null=null;

export async function createProducer(){
    if(producer)return producer;
    
    const _producer=kafka.producer();
    await _producer.connect();
    producer=_producer;
    return producer;
}

export async function produceMessage(message:string){
    const producer=await createProducer();
    await producer.send({
        messages:[{key:`message-${Date.now()}`,value:message}],
        topic:'MESSAGES'
    })
}

export async function startMessageConsumer(){
    console.log('consumer is running');
    const consumer=kafka.consumer({groupId:"default"});
    await consumer.connect();
    await consumer.subscribe({topic:"MESSAGES",fromBeginning:true});

    await consumer.run({
        autoCommit:true,
        eachMessage:async({message,pause})=>{
            if(!message.value)return;
            console.log('new messaged recieved for kafka consumer ',message.value);
            try{
                await prismaClient.message.create({
                data:{
                    text:message.value?.toString()
                }
            })
            }catch(err){
                console.log('something went wrong',{err});
                //pause the consumer
                pause();
                setTimeout(()=>{consumer.resume([{topic:'MESSAGES'}])},60*1000) //resume after 1 min
            }
            
        }
    })
}

export default kafka;