import { serverFeedback, findError } from "../helpers/Feedback";
import db from '../database'
const forum = {
    async addChat(req, res) {
        try {
           const {username,text} = req.body;
            const table = 'chats'
            const columns = `username,text`;
            const values = `'${username}', '${text}'`;
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
