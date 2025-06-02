# Chat

A Real-time scalable chat app.

This project implements a real-time, horizontally scalable chat system using:

- **Socket.IO** for WebSocket-based realtime communication between users
- **Redis Pub/Sub** for communication between socket instances/servers.
- **Apache Kafka** for durable, stream-based message ingestion.
- **PostgreSQL** for persisting messages

General tools used...
- **Turborepo** to give a monorepo structure to the codebase.
- **Typecript** as the general language used to build the frontend and the backend
- **Next.js(app router)** used in the frontend.
- **Prisma** as the ORM for communication with PostgresDB
- **Aiven** for cloud instances of postgres , redis and kafka.

---

# Architecture Overview

![image](https://github.com/user-attachments/assets/c6d68c18-0e72-4862-b6d3-3c8b71908378)

# Why is this scalable?

The first idea is that , using only one socket server on top of http is not scalable since it cannot handle so many TCP connections at once. So we need to add more socket servers. But to enable communication between users connected to two different sockets , we need to have communication established between the sockets themselves , so using a pub/sub model is the easiest solution for that. So we can use Redis Pub/Sub for that.

The second idea is that , we need to persist the messages that are being generated. So we have to use a database for that. But in a chat application , there will be a lot of messages generated per second , so that many write requests to the database will shut down the database , since databases are not designed for such a high rate of throughput . So we have to keep a middleman to recieve the messages at that high rate of throughput.
Apache kafka is the easiest solution for that(although kafka can also act as a temporary storage for messages themselves , but cannot be a database). The kafka producer will be the Redis subscriber ,and using Node.js as the kafka consumer. This consumer will then write to the postgres(which right now is each message to postgres, which is not very good , batch processing would be better). 

Even if the postgres instance goes down , the consumer can pause for sometime , and then resume once again after a certain period , after the database is once again up and running.

