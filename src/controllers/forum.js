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
   
}
export default forum;
