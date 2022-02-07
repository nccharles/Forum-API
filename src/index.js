import express from 'express'
import frouter from './routers/forum';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json'
import moment from "moment"
import process from 'process'
import path from 'path'
import http from 'http'
import cors from 'cors';
import socketio from 'socket.io'
import pages from './routers/pages';
import db from './database'
import formatMessage from './utils/message';
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, '../UI')));
app.use(cors());
// Body parser Middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

//app pages
app.use("/", pages);
app.use('/api/v3', frouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// sends out the 10 most recent messages from recent to old
const emitMostRecentMessages = async (socket, room) => {
  const result = (await db.getChats('*')).filter(c => c.room === room.id)
  if (result.length) {
    result.map(i => i.created_at = moment(i.created_at).format('dd MM,YY h:mm A'))
    io.to(room.name).emit('message', result);
  } else {
    socket.emit('message', formatMessage("bot", 'Welcome, Here is the begginning of your chats'))
  }
};


// Run wen client joins
io.on('connection', socket => {
  socket.on('joinRoom', async ({ username, room }) => {
    username = username.toLowerCase();
    let userData = [];
    if (!(await db.getUsers(username)).length) {
      await db.dataCreate('users', 'username', `'${username}'`)
    }
    room = room.toLowerCase()
    const a = username + "_" + room;
    const b = room + "_" + username;
    let roomData = [];
    if (room === 'devs') {
      roomData = await db.getRoomChats(room, room);
      userData = await db.getUsers();
    } else {
      roomData = await db.getRoomChats(a, b);
      if (roomData.id === undefined) {
        await db.dataCreate('rooms', `name,participants`, `'${a}', '{${username},${room}}'`)
        roomData = await db.getRoomChats(a, b);
        userData = roomData.participants
      }
    }
    socket.join(roomData.name)
    // Welcome current user
    emitMostRecentMessages(socket, roomData)
    // Broadcast when a user connects
    // socket.broadcast.to(roomData.name).emit('message', formatMessage("bot", `${username} has joined the chat`))

    // Send users and room info
    io.to(roomData.name).emit('roomUsers', {
      room: roomData.name,
      rooms: (await db.getRooms('*')).filter(r => r.participants.includes(username) || r.participants.includes('devs')),
      users: userData
    })
    // Listen for chatMessage
    socket.on('chatMessage', msg => {
      db.dataCreate('chats', `username,text,room`, `'${username}', '${msg}',${roomData.id}`)
        .then((result) => {
          io.to(roomData.name).emit('message', formatMessage(username, msg));
        })
        .catch((err) => io.emit(err));

    })
    // runs when client disconnect
    socket.on('disconnect', async () => {
      // Send users and room info
      io.to(roomData.name).emit('roomUsers', {
        room: roomData.name,
        rooms: (await db.getRooms('*')).filter(r => r.participants.includes(username) || r.participants.includes('devs')),
        users: userData
      })
    })
  })

})
const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
export default server