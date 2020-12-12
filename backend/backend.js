const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const multer = require('multer');
const upload = multer({dest:"C:/Users/Sam/Downloads/Project_Webdev/Project-Webdev/src/assets"});

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const fs = require('fs');

const PORT = process.env.PORT || 3000

live_ids = {};
active_rooms = ["Default Room"];
rooms_joined = {};
registered_users = [{username: 'a', pass:'b', avatar:'default'}];
login_valid = 0;
messages_list = {"Default Room": []};
private_messages_list = {}

app.get('/', (req, res) => res.send('hello!'));

app.post('/upload', upload.single('file'), (req, res, next) => {
    console.log("upload try:", req.body["username"]);
    const file = req.file;
    // Rename the file 
    fs.rename("C:/Users/Sam/Downloads/Project_Webdev/Project-Webdev/src/assets/"+file.filename, "C:/Users/Sam/Downloads/Project_Webdev/Project-Webdev/src/assets/"+req.body["username"], () => { 
        console.log("AVATAR UPDATED", req.body["username"]); 
    }); 
    console.log(file.filename);
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
    return false;
  })



io.on("connection", (socket) => {
    console.log("new connection " + socket.client.id);

    socket.on("disconnect", () => {
        console.log("disconnect " + socket.client.id);
        for (i in live_ids) {
            if (live_ids[i] == socket.id) {
                delete live_ids[i];
                break;
            }
        }
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
                live_ids[user.username] = socket.id;
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
            user.avatar = 'default';
            fs.copyFile("C:/Users/Sam/Downloads/Project_Webdev/Project-Webdev/src/assets/default", "C:/Users/Sam/Downloads/Project_Webdev/Project-Webdev/src/assets/"+user.username, ()=>{});
            registered_users.push(user);
        }
    })

    // Create room
    socket.on("create", (user) => {
        user = JSON.parse(user);
        console.log(user);
        if (active_rooms.indexOf(user.roomname) === -1) {
            active_rooms.push(user.roomname);
            io.to(socket.id).emit("create", "1");
            io.emit("rooms list", active_rooms.toString());
            messages_list[user.roomname] = [];
        }
        else {
            io.to(socket.id).emit("create", "0");
        }
    })

    // Join room
    socket.on("join", (user) => {
        user = JSON.parse(user);
        rooms_joined[user.username] = user.roomname;
        var m = [];
        for (x in messages_list[user.roomname]) {
            m.push(JSON.stringify(messages_list[user.roomname][x]));
        }
        socket.join(user.roomname);
        io.to(socket.id).emit("join", m.toString());
    })

    // Leave Room
    socket.on("leave", (user) => {
        user = JSON.parse(user);
        socket.leave(rooms_joined[user.username]);
        delete rooms_joined[user.username];
    })

    // Send Message
    socket.on("message", (user) => {
        user = JSON.parse(user);
        console.log(rooms_joined,"\n", user);
        socket.to(rooms_joined[user.username]).emit("message", JSON.stringify(user));
        messages_list[rooms_joined[user.username]].push(user);
    })

    // Validate user to send private message to
    socket.on("private message start", (user) => {
        user = JSON.parse(user);
        var m = [];
        for (x in private_messages_list[user.username]) {
            m.push(JSON.stringify(private_messages_list[user.username][x]));
        }
        io.to(socket.id).emit("private message start", m.toString());
    })

    // Send Private Message
    socket.on("private message", (user) => {
        user = JSON.parse(user);
        console.log(user);
        if (live_ids[user.username2] !== undefined)
        {
            io.to(live_ids[user.username2]).emit("private message", JSON.stringify(user));
        }
        if (private_messages_list[user.username1] === undefined)
            private_messages_list[user.username1] = [];

        if (private_messages_list[user.username2] === undefined)
            private_messages_list[user.username2] = [];

        private_messages_list[user.username1].push(user);
        private_messages_list[user.username2].push(user);
    })

    // Requesting rooms list
    socket.on("rooms list", () => {
        io.to(socket.id).emit("rooms list", active_rooms.toString());
    })

})
server.listen(PORT, () => {
    console.log("listening on *:" + PORT)
})