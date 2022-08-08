const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const path = require('path');
const jwt = require('jsonwebtoken')
const { getSystemErrorMap } = require('util')

// Connect to db
mongoose.connect(process.env.MONGO_URI)

mongoose.connection.on('connected', () => {
    console.log(`Connected to database ${process.env.MONGO_URI}`)
})

mongoose.connection.on('error', (err) => {
    console.log(`Database error: ${err}`)
})

const app = express()

app.use(cors())

// express bodyparser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Passport middleware
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize())
app.use(passport.session())
require("./config/passport")(passport)

app.get('/', (req, res) => {
    res.send('invaild endpoint');
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    });
}

const server = app.listen(port, () => console.log(`Server started on port ${port}`))

// Sockets
const io = require("socket.io")(server)

let users = [];

const addCommander = (userId, socketId) => {

    user = getUser(userId)

    if (user) {
        console.log("Adding commander")
        user.commanderSocket = socketId
    } else {
        console.log("New user (commander)")
        users.push({
            userId,
            commanderSocket: socketId
        })
    }

    console.log(user)
};

const addClient = (userId, socketId) => {
    user = getUser(userId)

    if (user) {
        console.log("Adding client")
        user.clientSocket = socketId
    } else {
        console.log("New user (client)")
        users.push({
            userId,
            clientSocket: socketId
        })
    }
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.use((socket, next) => {
  const token = socket.handshake.query.token
  const socketType = socket.handshake.query.type
  if (token && (socketType === 'commander' || socketType === 'client')) {
    jwt.verify(token.slice(4), process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded
      socket.socketType = socketType
      next()
    })
  } else {
    next(new Error('Authentication error'));
  }
})

io.on("connection", (socket) => {

  if (socket.socketType === 'commander') {
    const user = getUser(socket.decoded.id)
    if (user) {
      io.to(user?.clientSocket).emit("commanderConnected")
    }
    addCommander(socket.decoded.id, socket.id);
  }
  else if (socket.socketType === 'client') {
    const user = getUser(socket.decoded.id)
    if (user) {
      io.to(user?.commanderSocket).emit("clientConnected")
    }
    addClient(socket.decoded.id, socket.id);
  }

  //magic
  socket.on("sendOptions", (options) => {
    console.log("Commander sent options")
    const user = getUser(socket.decoded.id);
    io.to(user?.clientSocket).emit("getOptions", options);
  });

  socket.on("disconnect", () => {
    if (socket.socketType === 'commander') {
      const user = getUser(socket.decoded.id)
      if (user) {
        io.to(user?.clientSocket).emit("commanderDisconnected")
      }
    }
    else if (socket.socketType === 'client') {
      const user = getUser(socket.decoded.id)
      if (user) {
        io.to(user?.commanderSocket).emit("clientDisconnected")
      }
    }
  });
});

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/cheat', require('./routes/cheatRoutes'))