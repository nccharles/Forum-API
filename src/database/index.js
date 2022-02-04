import "dotenv/config";
import { Pool } from "pg";
import { DB } from "../config/database";
import { serverFeedback } from "../helpers/Feedback";
const pool = new Pool({
  connectionString: DB
});
const query = (text, params, isArr = false) => {

  return new Promise(async (resolve, reject) => {
    pool
      .query(text, params)
      .then(async  response => {
        const { rows } = response;
        isArr ? resolve(rows) : resolve(rows[0]);
        pool.end()
      })
      .catch(async err => {
        reject(err);
        pool.end()
      });
  });
};

const getSocketMessages = () => {
  return new Promise((resolve) => {
     pool.query(
        "SELECT * FROM chats ORDER BY id DESC LIMIT 10",
        (error, results) => {
           if (error) {
              throw error;
           }
           resolve(results.rows);
         }
     );
  });
};
const getSocketRooms = () => {
   return new Promise((resolve) => {
      pool.query(
         "SELECT * FROM rooms ORDER BY id DESC",
         (error, results) => {
            if (error) {
               throw error;
            }
            resolve(results.rows);
          }
      );
   });
 };
const getSocketUsers = (username) => {
  return new Promise((resolve) => {
     pool.query(
        `SELECT * FROM users`,
        (error, results) => {
           if (error) {
              throw error;
           }
           resolve(results.rows);
         }
     );
  });
};
const createSocketUser = (username) => {
  return new Promise((resolve) => {
     pool.query(`INSERT INTO users (username) VALUES ($1) RETURNING *;`,
        [username],
        (error, results) => {
           if (error) {
              throw error;
           }
           resolve(results.rows);
        }
     );
  });
};
const createSocketMessage = (message) => {
  return new Promise((resolve) => {
     pool.query(`INSERT INTO chats (username,text,room) VALUES ($1, $2,$3) RETURNING *;`,
        [message.username,message.text,message.room],
        (error, results) => {
           if (error) {
              throw error;
           }
           resolve(results.rows);
        }
     );
  });
};
const createSocketRoom = (message) => {
   return new Promise((resolve) => {
      pool.query(`INSERT INTO chats (username,room,text) VALUES ($1, $2,$3) RETURNING *;`,
         [message.username,message.room,message.text],
         (error, results) => {
            if (error) {
               throw error;
            }
            resolve(results.rows);
         }
      );
   });
 };
const dataCreate = async (res, table, columns, values) => {
  const queryString = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *;`;
  const { rows: Result } = await pool.query(queryString);
  return serverFeedback(res, 201, ...['status', 201, 'message', 'success', 'data', Result[0]]);
};

const getChats = async (columns) => {

  const query = `SELECT ${columns} FROM chats;`;
  const { rows } = await pool.query(query);
  return rows;
}
const getRooms = async (columns) => {

   const query = `SELECT ${columns} FROM rooms;`;
   const { rows } = await pool.query(query);
   return rows;
 }
 const getRoomChats = async (a,b) => {

   const query = `SELECT * FROM rooms WHERE name='${a}' or name='${b}';`;
   let { rows } = await pool.query(query);
   rows[0].chats=[]
   if(rows){
   const chatquery = `SELECT * FROM chats where room=${rows[0].id};`;
   const data = (await pool.query(chatquery)).rows; 
  rows[0].chats=data
   }
   return rows[0];
 }

export default { query,getRoomChats,getRooms, getChats,getSocketRooms, dataCreate,getSocketMessages,createSocketMessage,createSocketUser,getSocketUsers };
