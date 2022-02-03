import express from 'express'
import frouter from './routers/forum';
import bodyParser from 'body-parser';
import moment from "moment"
import process from 'process'
import path from 'path'
import http from 'http'
import cors from 'cors';
import socketio from 'socket.io'
import db from './database'
import formatMessage from './utils/message';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './utils/users';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// Body parser Middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/v3', frouter);
// sends out the 10 most recent messages from recent to old
const emitMostRecentMessages = (socket,user) => {
  db.getSocketMessages()
  .then((result) => {
    if (result.length) {
      result.map(i=>i.created_at=moment(i.created_at).format('h:mm A'))
      io.to(user.room).emit('message', result.reverse());
    } else {
      socket.emit('message', formatMessage(user.room, 'Welcome here is the begginning of your chats'))
    }
  })
  .catch(console.log);
};


// Run wen client joins
io.on('connection', socket => {
  socket.on('joinRoom',async ({ username, room }) => {
    username=username.toLowerCase();
    let userData=await db.getSocketUsers();
    let checkUser=[];
    if(!userData.some(u=>u.username===username)){
      const newUser= await db.createSocketUser(username)
      userData.push(newUser[0])
      checkUser.push(newUser[0]) 
    }else{
      checkUser= userData.filter(u=>u.username===username)
    }
    const user = userJoin(checkUser[0], room)
    socket.join(user.room)
    // Welcome current user
    emitMostRecentMessages(socket,user)
    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(user.username, `${user.username} has joined the chat`))

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
     // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(checkUser[0].username)

    db.createSocketMessage(formatMessage(user.username, msg))
      .then((_) => {
        io.to(user.room).emit('message', formatMessage(user.username, msg));
      })
      .catch((err) => io.emit(err));

  })
    // runs when client disconnect
  socket.on('disconnect', () => {
    const user = userLeave(checkUser[0].username);
    if (user) {
      io.to(user.room).emit('message', formatMessage(user.username, `${user.username} has left the chat`))
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }
  })
  })

})
const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
export default server