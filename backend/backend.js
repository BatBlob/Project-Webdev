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

active_rooms = ["sex"];
rooms_joined = {};
registered_users = [{username: 'a', pass:'b', avatar:'default'}];
login_valid = 0;
messages_list = {sex: []};

app.get('/', (req, res) => res.send('hello!'));

// app.post('/upload', upload.single('photo'), (req, res) => {
//     console.log("UPLOADED");
//     if(req.file) {
//         res.json(req.file);
//     }
//     else throw 'error';
// });

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
      res.send(file);
  })

// app.post('/upload', (req, res) => {
//     console.log("upload try:", req.body);
//     // upload.single(req.file);
// });

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
            user.avatar = 'default';
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
        // console.log(messages_list);
        user = JSON.parse(user);
        rooms_joined[user.username] = user.roomname;
        var m = [];
        for (x in messages_list[user.roomname]) {
            m.push(JSON.stringify(messages_list[user.roomname][x]));
        }
        socket.join(user.roomname);
        io.to(socket.id).emit("join", m.toString());
    })

    // Send Message
    socket.on("message", (user) => {
        // console.log(messages_list, user, rooms_joined);
        user = JSON.parse(user);
        console.log(rooms_joined[user.username], user);
        socket.to(rooms_joined[user.username]).emit("message", JSON.stringify(user));
        messages_list[rooms_joined[user.username]].push(user);
    })

    // Requesting rooms list
    socket.on("rooms list", () => {
        io.to(socket.id).emit("rooms list", active_rooms.toString());
    })

})
server.listen(PORT, () => {
    console.log("listening on *:" + PORT)
})