const express = require("express");
const http = require("http");
const path = require("path");
const {Server} = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.io
io.on("connection", (socket) => {//every socket is a client
    console.log("A new user has connected ", socket.id) //every socket has a unique id

    // to send messages to everyone
    socket.on("user-message", (message) => {
        io.emit("message", message);
        // console.log("A new user messaged:", message);
    })

    // Listen for private messages
    socket.on("private-message", (data) => {
        const { recipientId, message } = data;  // Data should contain recipient's socketId and message
        io.to(recipientId).emit("message", `Private message: ${message}`);  // Send message to specific user
    });

    // using room - group
    // Join a room when the client specifies
    socket.on("join-room", (roomName) => {
        socket.join(roomName);
        socket.emit("message", `You joined room: ${roomName}`);
    });

    // Send a message to a specific room
    socket.on("room-message", (data) => {
        const { room, message } = data;
        io.to(room).emit("message", `Room message: ${message}`);  // Send to all in the room
    });

})

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
    return res.sendFile("/public/index.html");
})

server.listen(9000, () => console.log(`Server started at PORT: 9000`));