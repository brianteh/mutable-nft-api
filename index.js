import http from 'http'
import express from 'express'
import cors from 'cors'
import {Server} from 'socket.io'



const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"https://www.gamingtoad.ml",//the domain where the app is
        method:["GET","POST"],
    },
});
app.get("/",(req,res)=>{
    res.send("Hello World")
});

io.on("connection", (socket)=>{
    console.log(`User connected: ${socket.id}`);

    socket.on("send_message",(data)=>{
        console.log(data)
        socket.broadcast.emit("receive_message",data)
    });
    
});

server.listen(3001,()=>{
    console.log("Server running...");
});


