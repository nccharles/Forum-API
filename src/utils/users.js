const users = []

// Join user chat
const userJoin = ({id, username}, room) => {
    const user = { id, username, room }

    users.push(user)

    return user
}

// get Current user
const getCurrentUser = (username) => {
    return users.find(user => user.username === username)
}

//User leaves the chat
const userLeave = (username) => {
    const index = users.findIndex(user => user.username === username);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// get room users
const getRoomUsers = (room) => {
    return users.filter(user => user.room === room)
}

export default { userJoin, getCurrentUser, userLeave, getRoomUsers}