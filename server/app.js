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
  console.log(`user ${socket.id} connected`);


  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  //joining a room
  socket.on("room", (room) => {
    socket.join(room.id);
  });

  //Someone is typing
  socket.on("typing", data => {
    socket.broadcast.to(data.id).emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });

  //when soemone stops typing
  socket.on("stopTyping", (data) => {
    socket.broadcast.to(data.id).emit("notifyStopTyping");
  });

  socket.on("play", function(data) {
    console.log("play event");
    console.log(data);
    socket.broadcast.to(data.id).emit("play", {
      message: data.message
    });
  });

  socket.on("pause", function(data) {
    console.log("paused "+socket.id);
    socket.broadcast.to(data.id).emit("pause", {
      message: data
    });

  });

  socket.on("buffering", function(msg) {});

  socket.on("next", function(msg) {});

  socket.on("roundtrip", function (msg) {

  });


  // when someone send a message
  socket.on("chat message", function(data) {
    console.log("message: " + data);

    //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.to(data.id).emit("received", {
      message: data
    });


  });
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
