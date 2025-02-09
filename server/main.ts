import { SocketType } from "dgram";
import { SocketAddress } from "net";
import { Socket } from "socket.io";
import { GameroomManager } from "./GameroomManager";
import { InMemorySessionStore } from "./SessionStore";

const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const crypton = require("node:crypto");

const randomId = () => crypton.randomBytes(8).toString("hex");
const sessionStore = new InMemorySessionStore();
const gameRoomManager = new GameroomManager();
const PORT = 4000

const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:5173"
  }
});

app.use(cors())
let users = []
socketIO.use((socket, next) => {
  const userInfo: {} = socket.handshake.auth.userInfo
  console.log(userInfo)

  if (userInfo) {
    const sessionID = userInfo['sessionID'];
    console.log(sessionStore.sessions)
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = randomId()
  next();
});

socketIO.on('connection', (socket) => {
  console.log('sessionID, user ID, username: ' + socket.sessionID, socket.userID, socket.username)

  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
  });
  socket.join(socket.userID);


  console.log(`⚡: ${socket.id} user just connected!`)
  socket.on("message", data => {
    socketIO.emit("messageResponse", data)
  })

  socket.on("typing", data => (
    socket.broadcast.emit("typingResponse", data)
  ))

  socket.on("sessionUpdate", data => {
    users.push(data)
    sessionStore.saveSession(socket.sessionID, data)
    socketIO.emit("sessionUpdate", users)
  })

  socket.on("gameroomCreate", function (data, callback) {
    console.log("GAME ROOM MADE")
    const newID: string = randomId()
    gameRoomManager.newRoom(newID)
    callback(newID)
  })
  socket.on("gameroomUpdate", data => {
    gameRoomManager.updateGameRoom(data['id'], data['data'])
  })
  socket.on("gameroomGet", function (data, callback) {
    const room = gameRoomManager.findRoom(data['id'])
    callback(room)
  })
  socket.on("gameroomJoin", function (data, callback) {
    const roomID: string = data['id']
    if (gameRoomManager.findRoom(data['id'])) {
      const userID: string = data['userID']
      const sessionID: string = data['sessionID']
      const username: string = data['username']
      gameRoomManager.updateGameRoom(roomID, { 'players': { userID: { 'id': socket.userID, 'sessionID': socket.sessionID, 'username': socket.username } } })
      console.log(gameRoomManager.findAllRooms())
      socket.join(roomID)
      callback(roomID)
    }
  })
  socket.on("gameroomGetAll", function (data, callback) {
    const rooms = gameRoomManager.findAllRooms()
    callback(rooms)
  })
  socket.on('disconnect', async () => {
    console.log('🔥: A user disconnected');
    users = users.filter(user => user.socketID !== socket.id)
    socketIO.emit("newUserResponse", users)
    const matchingSockets = await socketIO.in(socket.userID).fetchSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
    }
    socket.disconnect()
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello" })
});


http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});