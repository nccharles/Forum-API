const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
// get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


const socket = io();

// Join Chatroom
socket.emit('joinRoom', { username, room })

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
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
const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = ` <p class="meta">${message.username}<span>${message.created_at}</span></p>
<p class="text">
 ${message.text}    
</p>`
    document.querySelector('.chat-messages').appendChild(div)
}
const outputRoomName = (room) => {
    roomName.innerHTML = room
}
const outputUsers = (users) => {
    userList.innerHTML = `
    ${users.map(user => `<li><a href="chat?username=${username}&room=${user.username}">${user.username}</a></li>`).join('')}`
}