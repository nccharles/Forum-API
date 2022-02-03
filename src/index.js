import express from 'express'
import frouter from './routers/forum';
import bodyParser from 'body-parser';
import process from 'process'
import path from 'path'
import http from 'http'
import cors from 'cors';
import socketio from 'socket.io'
import db from './database'
import formatMessage from '../utils/message';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from '../utils/users';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// Body parser Middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));


app.use('/api/v3', frouter);
// sends out the 10 most recent messages from recent to old
const emitMostRecentMessges = (socket,user) => {
  db.getSocketMessages()
  .then((result) => {
    if (result.length) {
      io.to(user.room).emit('message', result.reverse());
    } else {
      socket.emit('message', formatMessage(user.room, 'Welcome here is the begginning of your chats'))
    }
  })
  .catch(console.log);
};

// Run wen client joins
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)
    // Welcome current user
    emitMostRecentMessges(socket,user)
    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(user.username, `${user.username} has joined the chat`))

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id)

    db.createSocketMessage(formatMessage(user.username, msg))
      .then((_) => {
        io.to(user.room).emit('message', formatMessage(user.username, msg));
      })
      .catch((err) => io.emit(err));

  })

  // runs when client disconnect
  // socket.on('disconnect', () => {
  //   const user = userLeave(socket.id);
  //   if (user) {
  //     io.to(user.room).emit('message', formatMessage(user.username, `${user.username} has left the chat`))
  //     // Send users and room info
  //     io.to(user.room).emit('roomUsers', {
  //       room: user.room,
  //       users: getRoomUsers(user.room)
  //     })
  //   }
  // })
})
const port = process.env.PORT || 8080
const socketport = 5000


app.listen(port, () => {
  console.log(`App running on ${port}`)
})
server.listen(socketport, () => {
  console.log(`listening on *:${socketport}`);
});
