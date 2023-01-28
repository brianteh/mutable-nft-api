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

// game state



// miscellaneous functions
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
function getKeysByValue(object, value) {   
    return Object.keys(object).filter(key => object[key] === value); 
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
    socket.to(room_id).emit("new_player", 
    {
        user_id:socket_id,
        user_property:{
            walking_speed: 2,
            jumping_power: 2
        }// load from nft
    }
    )

    console.log(users)
    console.log(rooms)



    // When player disconnect
    socket.on('disconnect',()=>{

        socket.to(room_id).emit("player_leaving",{user_id:socket_id})
        rooms[users[socket_id]].num-=1
        delete users[socket_id]
        
        // console.log(users)
        // console.log(rooms)
        console.log(`${socket_id} left room ${room_id}`)
    })
    
    // Load players who previously joined the room
    socket.on("req_load_prev_player",()=>{
        let all_player = getKeysByValue(users,room_id)
        socket.emit("load_prev_player",{
            all_player:all_player,
            user_property:{
                walking_speed: 2,
                jumping_power: 2
            }// load from nft

        })
        console.log(room_id,all_player)
    })

    // Relaying movement data according to room
    socket.on("movement_self_player",(data)=>{
        socket.to(room_id).emit("movement_all_player",{user_id:data.user_id,user_x:data.user_x,user_y:data.user_y})
        //console.log({user_id:data.user_id,user_x:data.user_x,user_y:data.user_y})
    })



});



// Server 
server.listen(3001,()=>{
    console.log("Server running...");
});


