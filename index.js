const express = require("express");
const app = express();
const socketio = require("socket.io");
const namespaces = require('./data/namespaces')

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen("3001", () => {
  console.log("<============ server is connected successfully ==================>");
});
// our socket server is listing on our express server
const io = socketio(expressServer);




io.on("connection", (socket) => {

  let nsData = namespaces.map((ns)=>{
    return {
      img : ns.img,
      endPoint : ns.endPoint
    }
  })

  socket.emit('nsList' , nsData)
});


namespaces.forEach((namespace)=>{
  // console.log(namespace.endPoint)
    io.of(namespace.endPoint).on('connection' ,(nsSocket)=>{
    const userName = nsSocket.handshake.query.username
    
      console.log(`${nsSocket.id} has joined ${namespace.endPoint}`)
      nsSocket.emit('nsRoomLoad',namespace.rooms)

      nsSocket.on('joinRoom',(roomToJoin ,numberOfClientCallBack) =>{
        const roomTitleToLeave = nsSocket.rooms
        const [first,second] = roomTitleToLeave
        nsSocket.leave(second);
        updateUsersInRoom(namespace , second)
        nsSocket.join(roomToJoin)
        // io.of('/wiki').in(roomToJoin).clients((err, clients)=>{
        //   numberOfClientCallBack(clients.length);
        // })
        const nsRoom = namespace.rooms.find((room)=>{
          return room.roomTitle == roomToJoin.replace(" ","")
        }) 
        let roomToJoin1 = roomToJoin.replace(" ","")
        nsSocket.emit("roomHistory" , nsRoom.history)
       


        updateUsersInRoom(namespace , roomToJoin)
    
      })


      nsSocket.on('newMessageToServer',(msg)=>{
        // console.log(msg)
        const fullMsg = {
          text : msg.text,
          time : Date.now(),
          username : userName,
          avatar : 'https://via.placeholder.com/30'
        }

        console.log(nsSocket.rooms ,"room")
        const roomTitle = nsSocket.rooms
        const [first,second] = roomTitle
        let roomName = second
        let nsRoom = namespace.rooms.find((room)=>{
          return room.roomTitle ==  roomName.replace(" ",'')
        })

        nsRoom.addMessage(fullMsg)
      //  console.log(nsRoom)
        io.of(msg.endPoint).to(roomName).emit('messageToClients' , fullMsg )
      })
    })
  })

  function updateUsersInRoom(namespace , roomToJoin){
    io.of(namespace.endPoint).in(roomToJoin).allSockets().then(async result=>{

      io.of(namespace.endPoint).in(roomToJoin).emit('updatedNumberOfUser', {size : result.size})
      
     } )
  }