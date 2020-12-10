const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000

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

})
server.listen(PORT, () => {
    console.log("listening on *:" + PORT)
})