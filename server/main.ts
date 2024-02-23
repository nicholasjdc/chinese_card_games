
const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const crypton = require("node:crypto");
const randomId = () => crypton.randomBytes(8).toString("hex");
const { InMemorySessionStore } = require("./SessionStore");
const sessionStore = new InMemorySessionStore();
const PORT = 4000

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5173"
    }
});

app.use(cors())
let users = []
socketIO.use((socket, next) => {
  console.log('use')
  const sessionID = socket.handshake.auth.sessionID;
  console.log('sid: ' +socket.handshake.auth.sessionID)
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  /*
  if (!username) {
      console.log('broken')
    return next(new Error("invalid username"));
  }
  */
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
  res.json({message: "Hello"})
});

   
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});