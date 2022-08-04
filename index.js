const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const path = require('path');

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

// Include socket object to every request
app.use((req, res, next) => {
    req.io = io
    next()
})

// Socketing
let users = [];

const userExists = (userId) => {
    return users.some((user) => user.userId === userId)
}

const addCommander = (userId, socketId) => {

    user = getUser(userId)

    if (user) {
        console.log("Adding commander")
        user.commanderSocket = socketId
    } else {
        console.log("new user (commander)")
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

const removeCommander = (commanderSocket) => {
  users = users.filter((user) => user.commanderSocket !== commanderSocket);
};

const removeClient = (clientSocket) => {
  users = users.filter((user) => user.clientSocket !== clientSocket)
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// User object has { userId, commanderSocket, clientSocket }
// Client app will have socket that receives commands from commander
// Client app calls addCommander
// Commander app has socket that calls sendOptions while client listens for getOptions 

io.on("connection", (socket) => {
  //when connect

  socket.on("addCommander", (userId) => {
    console.log("a commander connected.");
    addCommander(userId, socket.id);
  });

  socket.on("addClient", (userId) => {
    console.log("a client connected.");
    addClient(userId, socket.id);
  });

  //send and get options
  socket.on("sendOptions", ({ senderId, options }) => {
    console.log("Commander sent options")
    const user = getUser(senderId);
    console.log(user)
    io.to(user?.clientSocket).emit("getOptions", {
      senderId,
      options,
    });
  });

  //when disconnect
  socket.on("disconnectCommander", () => {
    console.log("a commander disconnected!");
    removeCommander(socket.id);
    io.emit("getUsers", users);
  });

  socket.on("disconnectClient", () => {
    console.log("a client disconnected!");
    removeClient(socket.id);
    io.emit("getUsers", users);
  });
});

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/cheat', require('./routes/cheatRoutes'))