const express = require("express")
const http = require("http")
const cors = require('cors')
const app = express()
app.use(cors)
const server = http.createServer(app)
const io = require("socket.io")(server,{
    cors:{
        origin: process.env.CLIENT,
        methods:["GET","POST"]
    }
})

io.on('connection',(socket)=>{
    socket.emit("me",socket.id)

    socket.on("disconnect",()=>{
        socket.broadcast.emit("callEnded")
    })

    socket.on("callUser",(data)=>{
        io.to(data.userToCall).emit("callUser",{signal:data.signalData,from:data.from,name:data.name})
    })

    socket.on("answerCall",(data)=>{
        io.to(data.to).emit("callAccepted",data.signal)
    })
})

server.listen(process.env.PORT || 5000, ()=> console.log('Server is up and running on port 5000'))