const express = require("express");
const app = express();


//require the http module
const http = require("http").Server(app);

// require the socket.io module
const io = require("socket.io");

const port = 5000;

// //bodyparser middleware
// app.use(bodyParser.json());


//set the express.static middleware
app.use(express.static(__dirname + "/public"));

//integrating socketio
socket = io(http);

//setup event listener
socket.on("connection", (socket) => {
  // var name = "User";
  // socket.player = name;
  console.log(`user ${socket.id} connected`);

  socket.on("changeUsername", (data) => {
    socket.player = data.username;
  });

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  //joining a room
  socket.on("room", (data) => {
    socket.join(data.id, () => {
      var roomID = data.id;
      socket.player = "User " + socket.adapter.rooms[roomID].length;
      //console.log(socket.adapter.rooms[roomID].length);

      // let rooms = Object.keys(socket.rooms);
      // console.log(rooms); // [ <socket.id>, 'room 237' ]
    });
  });

  // DISCONNECT from room
  socket.on("leave", (data) => {
    socket.leave(data.room, () => {
      socket.to(data.room).emit("leftRoom", {
        message: `${socket.player} has left the room`,
      });
    });
  });

  //Someone is typing
  socket.on("typing", (data) => {
    socket.broadcast.to(data.id).emit("notifyTyping");
  });

  //when soemone stops typing
  socket.on("stopTyping", (data) => {
    socket.broadcast.to(data.id).emit("notifyStopTyping");
  });

  // Play Event on Party
  socket.on("play", function (data) {
    console.log("play event");
    socket.broadcast.to(data.id).emit("play", {
      message: data.message,
      time: data.time
    });
  });

  // Pause event on Party
  socket.on("pause", function (data) {
    console.log("paused " + socket.id);
    socket.broadcast.to(data.id).emit("pause", {
      message: data.message,
      time: data.time
    });
  });

  socket.on("buffering", function (msg) {});

  socket.on("next", function (msg) {});

  socket.on("roundtrip", function (msg) {});

  // when someone send a message
  socket.on("chat message", function (data) {

    socket.broadcast.to(data.id).emit("received", {
      message: data.message,
      name: socket.player,
    });
  });
});


http.listen(port, () => {
  console.log("Running on Port: " + port);
});
