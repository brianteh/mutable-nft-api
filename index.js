import http from 'http'
import express from 'express'
import cors from 'cors'
import {Server} from 'socket.io'
import z from 'zod'

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",//the domain where the app is
        method:["GET","POST"],
    },
});

// initial configuration
let users = {};
const MAX_ROOMS = 10;
const MAX_PLAYER = 100;
const MAX_PLAYER_IN_ROOM = 2;
let rooms = [];
for(let i=0;i<MAX_ROOMS;i++){
    rooms.push({room_id: i,num: 0})
}

// User Socket
io.of("/user").on("connection", (socket)=>{
    
    const socket_id = socket.id;

    // Search available rooms
    let available_room_ids = rooms.filter((room,index)=>{
        return room.num<MAX_PLAYER_IN_ROOM
    })

    // Assign user to available room
    users[socket_id]=available_room_ids[0].room_id
    rooms[users[socket_id]].num+=1
    
    const room_id = users[socket_id]
    socket.join(room_id)

    // Notice other players in the same room
    socket.to(room_id).emit("new_player", {user_id:socket_id})

    console.log(users)
    console.log(rooms)

    // When player disconnect
    socket.on('disconnect',()=>{

        socket.to(room_id).emit("player_leaving",{user_id:socket_id})
        rooms[users[socket_id]].num-=1
        delete users[socket_id]
        
        console.log(users)
        console.log(rooms)
    })

    ///////////////
    // js library zod 
    socket.on("movement_self_player",(data)=>{
        let direction = data.direction;
        let user_id = data.user_id;
    })



});



// Server 
server.listen(3001,()=>{
    console.log("Server running...");
});


