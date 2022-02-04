import { serverFeedback, findError } from "../helpers/Feedback";
import db from '../database'
const forum = {
    async addChat(req, res) {
        try {
           const {username,text,room} = req.body;
            const table = 'chats'
            const columns = `username,text,room`;
            const values = `'${username}', '${text}',${room}`;
            db.dataCreate(res, table, columns, values)
                .then(response => {
                    return response
                }).catch(err => {
                    console.log(err)
                    return findError(res);
                });
        } catch (err) {

            return findError(res);
        }
    },
    async addRoom(req, res) {
        try {
           const {username} = req.body;
            const {other}=req.params
            const table = 'rooms'
            const columns = `name,participants`;
            const values = `'${username+"_"+other}', '{${username},${other}}'`;
            db.dataCreate(res, table, columns, values)
                .then(response => {
                    return response
                }).catch(err => {
                    return findError(res);
                });
        } catch (err) {

            return findError(res);
        }
    },

    async addUser(req, res) {
        try {
           const {username} = req.body;
            const table = 'users'
            const columns = `username`;
            const values = `'${username.toLowerCase()}'`;
            db.dataCreate(res, table, columns, values)
                .then(response => {
                    return response
                }).catch(err => {
                    return findError(res);
                });
        } catch (err) {

            return findError(res);
        }
    },

    getAllChats(req, res) {
        try {
            const columns = `*`;
            db.getChats(columns)
                    .then(response => {

                        return serverFeedback(res, 200, ...['status', 200, 'message', 'Ok', 'data', response]);
                    }).catch(err => {
                        return findError(res);
                    });
        } catch (err) {
            return findError(res);
        }
    },
    getRoomChats(req, res) {
        try {
            const {username} = req.body;
            const {other}=req.params;
            const a=username+"_"+other;
            const b=other+"_"+username;
            db.getRoomChats(a.toLowerCase(),b.toLowerCase())
                    .then(response => {

                        return serverFeedback(res, 200, ...['status', 200, 'message', 'Ok', 'data', response]);
                    }).catch(err => {
                        return findError(res);
                    });
        } catch (err) {
            return findError(res);
        }
    },
    getAllRooms(req, res) {
        try {
            const {username}=req.body
            const columns = `*`;
            db.getRooms(columns)
                    .then(response => {
                      const data=response.filter(r=>r.participants.includes(username.toLowerCase()))
                        return serverFeedback(res, 200, ...['status', 200, 'message', 'Ok', 'data', data]);
                    }).catch(err => {
                        return findError(res);
                    });
        } catch (err) {
            return findError(res);
        }
    },
}
export default forum;
