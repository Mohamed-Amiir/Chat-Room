const express = require("express");
const app = express(); // creat app

const http = require("http");
const server = http.createServer(app); //creat HTTP server for our app

const { Server } = require("socket.io");
const io = new Server(server); // attach our HTTP app server with socket.io

const userRouter = require("./routes/userRouter");
app.use("/user", userRouter);

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

mongoose
  .connect("mongodb://localhost:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public/main")));

// Use bodyParser middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/main/main.html"));
});

const privateChatRooms = {};

io.on("connection", (client) => {
  // Check if the user is already in a private chat room
  const privateChatRoomId = privateChatRooms[client.id];
  if (privateChatRoomId) {
    client.join(privateChatRoomId);
  } else {
    // Create a new private chat room for the user
    const newPrivateChatRoomId = Math.random().toString(36).substring(7);
    privateChatRooms[client.id] = newPrivateChatRoomId;
    client.join(newPrivateChatRoomId);
  }

  // Listen for private messages
  client.on("private message", ({ message, to }) => {
    // Emit the message to the recipient's private chat room
    io.to(privateChatRooms[to]).emit("private message", message);
  });
});



server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
