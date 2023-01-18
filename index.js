
import http from 'http'
import express from 'express'
import cors from 'cors'
import {Server} from 'socket.io'



const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",//the domain where the app is
        method:["GET","POST"],
    },
});

// app.get("/",(req,res)=>{
//     res.send("Hello World")
// });


// initial configuration
let users = {};
const MAX_ROOMS = 10;
const MAX_PLAYER = 100;
const MAX_PLAYER_IN_ROOM = 2;
let rooms = [];
for(let i=0;i<MAX_ROOMS;i++){
    rooms.push({room_id: i,num: 0})
}


io.of("/user").on("connection", (socket)=>{
    
    const socket_id = socket.id;

    console.log(`User connected: ${socket_id}`);

    // let available_room_ids = rooms.filter((room,index)=>{
    //     return room.num<MAX_PLAYER_IN_ROOM
    // })

    // users[socket_id]=available_room_ids[0]

    // socket.on('disconnect',()=>{
        
    //     delete users[socket_id]
    //     rooms[users[soc]]
    // })
    socket.on("send_message",(data)=>{
        console.log(data)
        socket.broadcast.emit("receive_message",data)
    });




    
});

server.listen(3001,()=>{
    console.log("Server running...");
});


