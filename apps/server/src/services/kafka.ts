import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
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

export default kafka;