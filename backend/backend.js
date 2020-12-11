const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000

active_rooms = ["sex"];
rooms_joined = {};
registered_users = [{username: 'a', pass:'b'}];
login_valid = 0;

app.get('/', (req, res) => res.send('hello!'));

io.on("connection", (socket) => {
    console.log("new connection " + socket.client.id);

    socket.on("disconnect", () => {
        console.log("disconnect " + socket.client.id);
    })

    // Login
    socket.on("login", (user) => {
        user = JSON.parse(user);
        login_valid = 0;
        console.log(`LOGIN ATTEMPT: user: ${user.username}`);
        for (i in registered_users) {
            i = registered_users[i];
            if (i.username === user.username && i.pass === user.pass) {
                console.log("LOGIN SUCCESSFUL");
                io.to(socket.id).emit("login", "1");
                login_valid = 1;
                break;
            }
        }
        if (login_valid == 0) {
            console.log("LOGIN FAIL")
            io.to(socket.id).emit("login", "0");
        }
    })

    // Register
    socket.on("register", (user) => {
        user = JSON.parse(user);
        login_valid = 0;
        console.log(`REGISTER ATTEMPT: user: ${user.username}`);
        for (i in registered_users) {
            i = registered_users[i];
            if (i.username === user.username) {
                console.log("REGISTER FAIL");
                io.to(socket.id).emit("login", "0");
                login_valid = 1;
                break;
            }
        }
        if (login_valid == 0)
        {
            io.to(socket.id).emit("login", "1");
            console.log("REGISTER SUCCESSFUL");
            registered_users.push(user);
        }
    })

    // Create room
    socket.on("create", (user) => {
        user = JSON.parse(user);
        if (active_rooms.indexOf(user.roomname) > -1) {
            active_rooms.push(user.roomname);
            io.to(socket.id).emit("create", "1");
        }
        else {
            io.to(socket.id).emit("create", "0");
        }
    })

    // Join room
    socket.on("join", (user) => {
        user = JSON.parse(user);
        rooms_joined.user.username = user.room; 
    })

    // Send Message
    socket.on("message", (user) => {
        user = JSON.parse(user);
        io.to(rooms_joined.user.username).emit("message", user.message);
    })

    // Requesting rooms list
    socket.on("rooms list", () => {
        io.to(socket.id).emit("rooms list", active_rooms.toString());
    })

})
server.listen(PORT, () => {
    console.log("listening on *:" + PORT)
})