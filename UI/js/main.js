const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
// get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const single = room;
const socket = io();

// Join Chatroom
socket.emit('joinRoom', { username, room })

// Get room and users
socket.on('roomUsers', ({ rooms, room, users }) => {
    outputRoomName(room)
    outputUsers(rooms)
})

// Message from server
socket.on('message', message => {
    if (Array.isArray(message)) {
        message.map(msg => outputMessage(msg))
    } else {
        outputMessage(message)
    }
    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value

    // clear after send a message
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()

    // Emit message to server
    socket.emit('chatMessage', msg)
})

// Output message to DOM
const outputMessage = (msg) => {
    const div = document.createElement('div');
    div.classList.add('msg-container');
    const divMessage=document.createElement('div');
    divMessage.classList.add(msg.username === "bot"?'bot':msg.username === username.toLowerCase() ? 'me':'message');
    divMessage.innerHTML = `<p class="meta">${msg.username === "bot"?"":msg.username === username.toLowerCase() ? "" : `<a href="chat?username=${username}&room=${msg.username}">${msg.username}</a>`}</p>
<p class="text">
 ${msg.text}    
</p><span>${msg.created_at}</span>`
div.appendChild(divMessage)
console.log(div)
    document.querySelector('.chat-messages').appendChild(div)
}
const outputRoomName = (room) => {
    roomName.innerHTML = room !== 'devs' ? single : room
}
const outputUsers = (users) => {
    userList.innerHTML = `
    ${users.map(user => `<li><a href="chat?username=${username}&room=${user.participants.find(u => u !== username.toLowerCase() || u === 'devs')}">${user.participants.find(u => u !== username.toLowerCase() || u === 'devs')}</a></li>`).join('')}`
}
